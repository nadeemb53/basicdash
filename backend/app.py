from flask import Flask, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
import urllib.request
import requests
import RPi.GPIO as GPIO
import time
import socket

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/sentinel-adp"
mongo = PyMongo(app)

@app.route("/api/bunkering-status")
#bunkering status
def bunkering_status():
    bunkering = mongo.db.dispcoll
    status = bunkering.find().sort([('$natural',-1)]).limit(1)
    for x in status:
        bunkering_status = x['bunkering_status']
    # result = {'bunkering_status': '1'}
    result = {'bunkering_status': bunkering_status}
    return jsonify(result)

@app.route("/api/getMass")
def getBunkeredMass():
    bunker = mongo.db.regcoll
    status = bunker.find().sort([('$natural',-1)]).limit(1)
    for x in status:
        total_mass = x['totalvalue_mass_flow_total']
    result = {'total_mass': total_mass}
    return jsonify(result)

#Network Status
@app.route("/api/network-status")
def network_status():
    host = 'http://google.com'
    # host2 = 'http://localhost:27017'
    try:
        intranet = socket.gethostbyname("Sentinel-MCU-01")
    except:
        intranet = 0
    vessel_name = 'Venus'
    internet = 0
    status1 = urllib.request.urlopen(host)
    # status2 = urllib.request.urlopen(host2)
    if status1.status == 200:
        internet = 1
    if intranet:
        intranet = 1
    result = {'internet_status':internet,'intranet_status': intranet,'vessel_name': vessel_name}
    return jsonify(result)



@app.route("/api/ip")
def getIP():
    try:
        sentinelpi = socket.gethostbyname("Sentinel-MCU-01")
    except:
        sentinelpi = ''
    externalip = requests.get('http://ipgrab.io').text
    displaypi = (([ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] if not ip.startswith("127.")] or [[(s.connect(("8.8.8.8", 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]]) + ["no IP found"])[0]
    result = {'display': displaypi, 'sentinel': sentinelpi, 'ip': externalip}
    return jsonify(result)

#Buzzer

def ringbuzzer():
    buzz = 16
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(buzz, GPIO.OUT)
    
    for i in range(5):
        GPIO.output(buzz, GPIO.HIGH)
        time.sleep(2)
        GPIO.output(buzz, GPIO.LOW)
        time.sleep(1)

    GPIO.cleanup()


