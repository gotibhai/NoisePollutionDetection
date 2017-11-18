#----------------------------------------------------------------------------#
# Imports

#----------------------------------------------------------------------------#

from flask import Flask, render_template, request
import requests
import logging
from logging import Formatter, FileHandler
import os
import base64
import json
import subprocess
from flask_cors import CORS
import pyrebase
from db_helper import postEventObject

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
	return "Hello Pushkin"

@app.route('/postData', methods=['POST'])
#postEventObject
def postData():
	print("Got the post request!")
	# Collect the EventData object : TimeStamp ,Location ,Max_decible and Media.
	EventMedia_json = request.get_json()
	timeStamp = EventMedia_json["time"]
	location = EventMedia_json["location"]
	amplitude = EventMedia_json["amplitude"]
	mp3sample = EventMedia_json["media"]
	print(mp3sample)
	print(timeStamp)
	print(location)
	mp3sample_decoded = base64.decodestring(mp3sample)
	output_result = open('result.wav', 'wb') # create a writable image and write the decoding result
	output_result.write(mp3sample_decoded)
	#subprocess.call(['ffmpeg', '-i', './result.mp3', './result.wav', '-y'])
	postEventObject(timeStamp,location,amplitude)
	return("Hello")

if __name__ == '__main__':
	print("Server is up.")
	port = int(os.environ.get('PORT', 5000))
	app.run(host='127.0.0.1', port=port)


