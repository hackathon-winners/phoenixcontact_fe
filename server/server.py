# Copy of http://stackoverflow.com/a/20104705
from flask import Flask, render_template, jsonify, request
from flask_sockets import Sockets
from flask_cors import CORS
import requests
from requests.auth import HTTPBasicAuth
from werkzeug.utils import secure_filename
import os
import json
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--user", help="Auth User for API Endpoint")
parser.add_argument("--pwd", help="Auth User PWD for API Endpoint")
parser.add_argument("--stream_id", help="Stream ID to upload")
parser.add_argument("--dataset_id", help="Dataset ID to upload")
args = parser.parse_args()

app = Flask(__name__, static_folder="../build/static", template_folder="../build")
CORS(app)
app.debug = True

sockets = Sockets(app)

@sockets.route('/echo')
def echo_socket(ws):
    while not ws.closed:
        message = ws.receive()
        ws.send(message[::-1])

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/image', methods=['GET', 'POST'])
def image():
    # auth info
    auth = HTTPBasicAuth(args.user, args.pwd);

    # save file
    imagefile = request.files.get('foto', '')
    dir_path = os.path.dirname(os.path.realpath(__file__))

    # check
    if imagefile:
        filename = os.path.join(dir_path, secure_filename(imagefile.filename))
        imagefile.save(filename)

    # save image
    image_file = {'image': open(filename, 'rb')}
    image_data = {'stream_id': args.stream_id}
    r = requests.post(f'https://vidapi.app.moonvision.io/datasets/{args.dataset_id}/add_image/', files=image_file, data=image_data, auth=auth)

    # get image info
    image = r.json()['image']
    img_url = f"https://vidapi.app.moonvision.io/images/{image['id']}/"

    r2 = requests.post("https://vidapi.app.moonvision.io/segment/supervised/", data=dict(images=[img_url], indexer="http://vidapi.app.moonvision.io/indexers/supervised-segmentation/14/"), auth=auth)    
    segment_id = r2.json()['id']

    while True:
        r3 = requests.get(f"http://vidapi.app.moonvision.io/segment/supervised/{segment_id}/", auth=auth)
        resp = r3.json()
        status = resp["task"][0]["status"]
        
        if status=="finished":
            result = resp["task"][0]
            break
        
    json.loads(result["result"])
    img_url, pixel_sums, confidences = json.loads(result["result"])

    return json.dumps(dict(url=img_url, sums=pixel_sums, configence=confidences))

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()