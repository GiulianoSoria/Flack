import os
import requests
import time

from threading import Lock
from flask import Flask, render_template, redirect, jsonify, request, copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, send, disconnect, rooms

from collections import deque

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

users = {}
my_messages = {'General': []}
rooms = ['General']
private_rooms = []


@app.route("/")
def index():
        return render_template('index.html', rooms = rooms, users = users, async_mode = socketio.async_mode)

@socketio.on('userdata')
def user_data(username):
        users[username] = request.sid
        print(users)

@socketio.on('chatroom_creation')
def chatroom_creation(room):
        if room in rooms:
                emit('chatroom error', 'This room name is already taken!')

        else:
                rooms.append(room)
                my_messages[room] = []
                join_room(room)
                print(rooms)
                print(room)
                data = {'room': room, 'messages': my_messages[room]}
                emit('join_chatroom', data)
        
@socketio.on('join_chatroom')
def join_chatroom(room):
        join_room(room)
        data = {'room': room, 'messages': my_messages[room]}
        print(data)
        emit('join_chatroom', data)

# @socketio.on('leave_chatroom')
# def leave_chatroom(room):
#         leave_room(room)
#         emit('leave_chatroom', room)

@socketio.on('change_chatroom')
def change_chatroom(old_chatroom, new_chatroom):
        leave_room(old_chatroom)
        join_room(new_chatroom)
        data = {'room': new_chatroom, 'messages': my_messages[new_chatroom]}
        print(data)
        emit('join_chatroom', data)

@socketio.on('new_message')
def messageHandler(json):
        my_time = time.ctime(time.time())
        my_data = {'username': json['username'], 'message': json['message'], 'my_time':my_time}
        my_messages[json['room']].append(my_data)
        
        if len(my_messages[json['room']]) > 100:
                my_messages[json['room']].pop(0)
        print(my_data)
        emit('new_message', my_data, room = json['room'])

@socketio.on('private_message')
def private_chatroom(data):
        recipient = users[data['recipient']]
        message = data['message']
        emit('private_message', message, room=recipient)

@socketio.on('disconnect_request')
def disconnect_request():
    @copy_current_request_context
    def can_disconnect():
        disconnect()
    emit('my_disconnect_response', {'data': 'Disconnected!'}, callback=can_disconnect)
    print('User is disconnected')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)