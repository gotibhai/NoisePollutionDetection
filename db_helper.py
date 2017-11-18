import pyrebase
from datetime import datetime as dt
from json import dumps


config = {
	"apiKey": "AIzaSyBWxP2O5cTKispWRieHmN2DAvE-WysD9vc",
	"authDomain": "noisepollutiondetection-74011.firebaseapp.com",
	"databaseURL": "https://noisepollutiondetection-74011.firebaseio.com",
	"projectId": "noisepollutiondetection-74011",
	"storageBucket": "",
	"messagingSenderId": "1047190133742"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()

def postEventObject(time,location,amplitude):
	#time = str(dt.today())
	testObj = {
		"time" : time,
		"Location" : location,
		"amplitude" : amplitude
	}
	db.child("EventObj").push(testObj)
