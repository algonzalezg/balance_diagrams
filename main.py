from flask import Flask, render_template, redirect, url_for
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField
from wtforms.validators import InputRequired, Email, Length
from flask_sqlalchemy  import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
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
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
token = ""
db = firebase.database()

class User(UserMixin):
    def __init__(self, user_info):
        id = user_info.get('idToken')
        username = user_info.get('email').split('@')[0]
        email = user_info.get('email')
        password = user_info.get('password')

@login_manager.user_loader
def load_user(token):
    return auth.get_account_info()

class LoginForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=4, max=100)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])
    remember = BooleanField('remember me')

class RegisterForm(FlaskForm):
    email = StringField('email', validators=[InputRequired(), Email(message='Invalid email'), Length(max=50)])
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=80)])


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        print(form.password)
        user = auth.sign_in_with_email_and_password(email=form.username.data, password=form.password.data)
        if user.get("registered"):
            token = user['idToken']
            #login_user(user.get('token'))
            #current_user = User.User(email=user.get('email'), token=user.get('token'))

            return redirect(url_for('templatecanvas'))
        else:
            return '<h1>Invalid username or password</h1>'
        #return '<h1>' + form.username.data + ' ' + form.password.data + '</h1>'

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

@app.route('/templatecanvas')
#@login_required
def templatecanvas():
    diagrams = list()
    diagrams_db = db.child("diagrams").get()
    for diagram in diagrams_db.each():
        diagrams.append(diagram.val())
    return render_template('templateCanvas.html', myval=diagrams)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
