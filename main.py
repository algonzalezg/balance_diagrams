from functools import wraps

from urllib3 import request

from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email, Length
from flask_sqlalchemy  import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, render_template, redirect, request, url_for, session
import pyrebase
import hashlib

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
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////mnt/c/Users/antho/Documents/login-example/database.db'
bootstrap = Bootstrap(app)
token = ""
db = firebase.database()


class LoginForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=4, max=100)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])
    remember = BooleanField('remember me')

class RegisterForm(FlaskForm):
    email = StringField('email', validators=[InputRequired(), Email(message='Invalid email'), Length(max=50)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])

#decorator to protect routes
def isAuthenticated(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        #check for the variable that pyrebase creates
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
        print(form.password)
        try:
            user = auth.sign_in_with_email_and_password(email=form.username.data, password=form.password.data)
            if user.get("registered"):
                user_id = user['idToken']
                user_email = user['email']
                session['usr'] = user_id
                session["email"] = user_email
                return redirect(url_for('addDiagram'))
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
        #return '<h1>' + form.username.data + ' ' + form.email.data + ' ' + form.password.data + '</h1>'

    return render_template('signup.html', form=form)

@app.route('/addDiagram', methods=['GET', 'POST'])
@isAuthenticated
def addDiagram():
    if request.method == "POST":
        # get the request data
        ejercicio = request.get_json()
        try:
            db.child("diagrams").child('ejercicio2').set(ejercicio)
            return redirect("/")
        except:
            return render_template("addDiagram.html", message="Something wrong happened")


    if (session['email'] == 'a.gonzalezgarci@gmail.com'):
        return render_template('addDiagram.html')

@app.route('/templatecanvas')
@isAuthenticated
def templatecanvas():
    diagrams = list()
    diagrams_db = db.child("diagrams").get()
    for diagram in diagrams_db.each():
        diagrams.append(diagram.val())
    return render_template('templateCanvas.html', myval=diagrams)

@app.route('/logout')
@isAuthenticated
def logout():
    auth.current_user = None
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
