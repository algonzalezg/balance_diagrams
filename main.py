from functools import wraps
from urllib3 import request
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SelectField
from wtforms.validators import InputRequired, Email, Length
from flask import Flask, render_template, redirect, request, url_for, session, g
import pyrebase
import json

app = Flask(__name__)

firebaseConfig = {
   "apiKey": "AIzaSyCmcOaoIRMCXoEcIvpQIaGycdSE4Ex_B-U",
   "authDomain": "tfgequilibrios.firebaseapp.com",
   "databaseURL": "https://tfgequilibrios.firebaseio.com",
   "projectId": "tfgequilibrios",
   "storageBucket": "tfgequilibrios.appspot.com",
   "messagingSenderId": "930034451079",
   "appId": "1:930034451079:web:d16e829d2509ea86602e22"
}

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
app.config['SECRET_KEY'] = 'Thisissupposedtobesecret!'
bootstrap = Bootstrap(app)
token = ""
db = firebase.database()
diagrams = {}
diagram_list = []
diagrams_db = db.child("diagrams").get()
for diagram in diagrams_db.each():
    diagram_list.append((diagram.val().get('material')))
    diagrams[diagram.key()] = diagram.val()

class LoginForm(FlaskForm):
    username = StringField('email', validators=[InputRequired(), Length(min=4, max=100)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])
    remember = BooleanField('remember me')

class RegisterForm(FlaskForm):
    email = StringField('email', validators=[InputRequired(), Email(message='Invalid email'), Length(max=50)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])

class SelectionForm(FlaskForm):
    materiales = SelectField('materiales')



def isAuthenticated(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not auth.current_user != None:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        try:
            user = auth.sign_in_with_email_and_password(email=form.username.data, password=form.password.data)
            if user.get("registered"):
                user_id = user['idToken']
                user_email = user['email']
                session['usr'] = user_id
                session["email"] = user_email
                return redirect(url_for('index'))
            else:
                return '<h1>Invalid username or password</h1>'
        except:
            return render_template("login.html", message="Wrong Credentials", form=form)
    return render_template('login.html', form=form)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = RegisterForm()

    if form.validate_on_submit():
        login = auth.create_user_with_email_and_password(email=form.email.data, password=form.password.data)
        auth.send_email_verification(login['idToken'])

        return '<h1>New user has been created!</h1>'
    return render_template('signup.html', form=form)

@app.route('/addDiagram', methods=['GET', 'POST'])
@isAuthenticated
def addDiagram():
    if request.method == "POST":
        # get the request data
        ejercicio = request.get_json()
        name = 'ejercicio'+str(len(diagram_list)+1)
        try:
            db.child("diagrams").child(name).set(ejercicio)
            return redirect("index")
        except:
            return render_template("addDiagram.html", message="Something wrong happened")
    if (session['email'] == 'diagramasdeequilibrio@gmail.com'):
        return render_template('addDiagram.html')


@app.route('/diagramSelection', methods=['GET', 'POST'])
@isAuthenticated
def diagramSelection():
    form = SelectionForm()
    form.materiales.choices = [(item, item) for item in diagram_list]
    if request.method == "POST":
        # get the request data
        ejercicio = form.materiales.data
        for item in diagrams.items():
            if item[1]['material'] == ejercicio:
                g.diagram = item[1]
                session['diagram'] = item[1]
        return redirect(url_for('templatecanvas'))
    else:
        return render_template('diagramSelection.html', form=form)





@app.route('/templatecanvas', methods=['GET', 'POST'])
def templatecanvas():
    return render_template('templateCanvas.html', myval=session['diagram'])



@app.route('/logout')
@isAuthenticated
def logout():
    auth.current_user = None
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
