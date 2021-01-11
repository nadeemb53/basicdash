from flask import Flask, jsonify
from flask_pymongo import PyMongo
import urllib.request
# import RPi.GPIO as GPIO
import time

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/dashboard"
mongo = PyMongo(app)

@app.route("/api/bunkering-status")
#bunkering status
def bunkering_status():
    field = mongo.db.dispcoll.find(sort=[( '_id', mongo.DESCENDING )]).limit(1)
    result = {'_id': str(field['_id']), 'Date': str(field['date']), 'Time': str(field['time']), 'Timestamp': str(field['timestamp']), 'UUID': str(field['uuid']), "BunkeringFlag" : str(field['bunkering_status'])}
    return jsonify(result)

#Network Status
@app.route("/api/network-status")
def network_status():
    host = 'http://google.com'
    try:
        urllib.request.urlopen(host) #Python 3.x
        result = {'internet_status': 1, 'intranet_status': 1}
        return jsonify(result)
    except:
        host = 'http://google.com'
        try:
            urllib.request.urlopen(host) #Python 3.x
            result = {'internet_status': 0, 'intranet_status': 1}
            return jsonify(result)
        except:
            urllib.request.urlopen(host) #Python 3.x
            result = {'internet_status': 0, 'intranet_status': 0}
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


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)
