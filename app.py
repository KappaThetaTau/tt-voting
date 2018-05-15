from gevent import monkey
monkey.patch_all()

import cgi
import uuid
import redis
from flask_socketio import SocketIO
from flask import Flask, render_template

app = Flask(__name__)
socketio = SocketIO(app)
db = redis.StrictRedis('localhost', 6379, 0)

YES_VOTE_COUNT_KEY = 'yes_vote_count'
NO_VOTE_COUNT_KEY = 'no_vote_count'
USERS_VOTED_KEY = 'users_voted'

# Helpers
def emit_votes(yes_count, no_count):
    socketio.emit('vote',
            {YES_VOTE_COUNT_KEY: yes_count,
                NO_VOTE_COUNT_KEY: no_count
                },
            namespace='/app')

# HTTP routes
@app.route('/')
def main():
    return render_template('index.html')

# WebSocket routes
@socketio.on('connect', namespace='/app')
def ws_connect():
    emit_votes(db.get(YES_VOTE_COUNT_KEY), db.get(NO_VOTE_COUNT_KEY))
    unique_id = str(uuid.uuid4())
    socketio.emit('uuid', {'uuid': unique_id}, namespace='/app')

@socketio.on('msg', namespace='/app')
def ws_chat(msg):
    socketio.emit('msg', {'msg': cgi.escape(msg['msg'])}, namespace='/app')

@socketio.on('vote', namespace='/app')
def ws_vote(msg):
    if not db.hexists(USERS_VOTED_KEY, msg['uuid']):
        if msg['vote'] == 'Yes':
            emit_votes(db.incr(YES_VOTE_COUNT_KEY), db.get(NO_VOTE_COUNT_KEY))
        elif msg['vote'] == 'No':
            emit_votes(db.get(YES_VOTE_COUNT_KEY), db.incr(NO_VOTE_COUNT_KEY))
        db.hset(USERS_VOTED_KEY, msg['uuid'], msg['vote'])

@socketio.on('vote_reset', namespace='/app')
def ws_vote_reset(msg):
    db.set(YES_VOTE_COUNT_KEY, 0)
    db.set(NO_VOTE_COUNT_KEY, 0)
    db.delete(USERS_VOTED_KEY)
    emit_votes(db.get(YES_VOTE_COUNT_KEY), db.get(NO_VOTE_COUNT_KEY))

@socketio.on('vote_undo', namespace='/app')
def ws_vote_undo(msg):
    vote = db.hget(USERS_VOTED_KEY, msg['uuid'])
    if vote == 'Yes':
        emit_votes(db.decr(YES_VOTE_COUNT_KEY), db.get(NO_VOTE_COUNT_KEY))
    elif vote == 'No':
        emit_votes(db.get(YES_VOTE_COUNT_KEY), db.decr(NO_VOTE_COUNT_KEY))
    db.hdel(USERS_VOTED_KEY, msg['uuid'])

if __name__=="__main__":
    socketio.run(app, host="0.0.0.0")

