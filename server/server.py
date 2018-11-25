# Copy of http://stackoverflow.com/a/20104705
from flask import Flask, render_template, jsonify, request
from flask_sockets import Sockets

app = Flask(__name__, static_folder="../build/static", template_folder="../build")
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
    # imagefile = request.files.get('image', '')
    # convert string of image data to uint8
    # nparr = np.fromstring(r.data, np.uint8)
    # decode image
    # img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # do some fancy processing here....
    return jsonify(image_url='https://picsum.photos/200/300',
        labels="rust")

if __name__ == '__main__':
    from gevent import pywsgi
    from geventwebsocket.handler import WebSocketHandler
    server = pywsgi.WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    server.serve_forever()