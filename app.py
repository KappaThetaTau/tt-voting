from gevent import monkey
monkey.patch_all()

import cgi
import redis
from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)
db = redis.StrictRedis('localhost', 6379, 0)

@app.route('/')
def main():
    return render_template('index.html')

@socketio.on('connect', namespace='/test')
def ws_conn():
    c = db.incr('counter')
    print "Incremented: {}".format(c)
    socketio.emit('counter', {'count': c}, namespace='/test')

@socketio.on('disconnect', namespace='/test')
def ws_disconn():
    c = db.decr('counter')
    print "Decremented: {}".format(c)
    socketio.emit('counter', {'count': c}, namespace='/test')

@socketio.on('msg', namespace='/test')
def ws_msg(msg):
    socketio.emit('msg', {'msg': cgi.escape(msg['msg'])}, namespace='/test')

if __name__=="__main__":
    socketio.run(app, host="0.0.0.0")

