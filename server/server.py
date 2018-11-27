# Copy of http://stackoverflow.com/a/20104705
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

import requests
from requests.auth import HTTPBasicAuth
from werkzeug.utils import secure_filename

from pyModbusTCP.client import ModbusClient

import os
import json
import argparse

from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument("--user", help="Auth User for API Endpoint")
parser.add_argument("--pwd", help="Auth User PWD for API Endpoint")
parser.add_argument("--stream_id", help="Stream ID to upload")
parser.add_argument("--dataset_id", help="Dataset ID to upload")
parser.add_argument("--indexer", type=int, default=15, help="Indexer ID to process")
args = parser.parse_args()

app = Flask(__name__, static_folder="../build/static", template_folder="../build")
CORS(app)

status_object = dict(status="")

@app.route("/status")
def status():
    global status_object
    return json.dumps(status_object)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/image', methods=['GET', 'POST'])
def image():
    global status_object

    # auth info
    auth = HTTPBasicAuth(args.user, args.pwd);

    # save file
    imagefile = request.files.get('foto', '')
    dir_path = os.path.dirname(os.path.realpath(__file__))

    # check
    if imagefile:
        filename = os.path.join(dir_path, secure_filename(imagefile.filename))
        imagefile.save(filename)


    # reisze image with PIL
    try:
        image = Image.open(filename)

        fixed_size_w = 843
        w, h = image.size

        if w > h:
            print('breiter')
            image.rotate(90)
            w, h = image.size
        print(h)
        print(w)
        scaling_factor = fixed_size_w / w
        h_new = int(round(scaling_factor * h))
        print(f"H x W {h_new} x {fixed_size_w}")
        image.resize((fixed_size_w, h_new))
        image.save(filename)
    except Exception as e:
        print(f"Error happened during resizing with params: {scaling_factor}, height: {h_new} and filename: {filename}")
        raise Exception

    # save image
    image_file = {'image': open(filename, 'rb')}
    image_data = {'stream_id': args.stream_id}

    r = requests.post(f'https://vidapi.app.moonvision.io/datasets/{args.dataset_id}/add_image/', files=image_file, data=image_data, auth=auth)

    # get image info
    image = r.json()['image']
    img_url = f"https://vidapi.app.moonvision.io/images/{image['id']}/"

    r2 = requests.post("https://vidapi.app.moonvision.io/segment/supervised/", data=dict(images=[img_url], indexer=f"http://vidapi.app.moonvision.io/indexers/supervised-segmentation/{args.indexer}/"), auth=auth)

    segment_id = r2.json()['id']

    loop_iter = 0
    while True:
        r3 = requests.get(f"http://vidapi.app.moonvision.io/segment/supervised/{segment_id}/", auth=auth)
        resp = r3.json()
        status = resp["task"][0]["status"]
        loop_iter += 1

        if status=="finished":
            result = resp["task"][0]
            break

    img_url, pixel_sums, confidences = json.loads(result["result"])

    print(pixel_sums)
    coverage = {}
    total_sum = h_new * fixed_size_w

    for key, value in pixel_sums.items():
        coverage[key] = int(round(value / fixed_size_w**2 * 100))
        print(f"For {key} got {coverage[key]} % coverage")

    try:
        coffe_cover_value = coverage['Coffee']
        c = ModbusClient(host="127.0.0.1", port=502)
        c.open()
        c.write_single_register(0, coffe_cover_value)    
        c.close()
    except Exception as e:
        print(e)

    status_object = dict(url=img_url, pixel_sums=pixel_sums, confidences=confidences, coverage=coverage['Coffee'])
    return json.dumps(status_object)

@app.route('/setfallback', methods=['GET'])
def setFallback():
    status_object = dict(url='HTTPS://STORAGE.GOOGLEAPIS.COM/MOONVISION-MEDIA-WEST1/IMAGES/20ABD36E-FF11-4293-8156-834B6DD6C4D5.PNG', pixel_sums=dict(BACKGROUND=123, BOTTLE=234), confidences=dict(BACKGROUND=0.9907367559525162, BOTTLE=0.7083586894819889))
    return json.dumps(status_object)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
