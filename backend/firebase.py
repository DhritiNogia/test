import firebase_admin
from firebase_admin import credentials, firestore

# Download your Firebase project serviceAccountKey.json
cred = credentials.Certificate("/assets/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
