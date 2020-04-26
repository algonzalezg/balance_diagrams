import pyrebase
import firebase_admin
from firebase_admin import credentials
from google.cloud import firestore
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="C:\\Users\\Alvaro\\Downloads\\tfgequilibrios-firebase-adminsdk-cmt2x-2f1f98e998.json"
firestore.Client()

# Add a new document
db = firestore.Client("tfgequilibrios")
doc_ref = db.collection(u'diagrams')

for doc in doc_ref.stream():
   print(u'{} => {}'.format(doc.id, doc.to_dict()))

# Then query for documents
users_ref = db.collection(u'users')

for doc in users_ref.stream():
    print(u'{} => {}'.format(doc.id, doc.to_dict()))
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

# Log the user in
user = auth.sign_in_with_email_and_password('a.gonzalezgarci@gmail.com', 'admintfg')

# Get a reference to the database service
db = firebase.database()

diagrams = db.child("diagrams").get()
for diagram in diagrams.each():
   print(diagram.key())  # Morty
   print(diagram.val())  # {name": "Mortimer 'Morty' Smith"}