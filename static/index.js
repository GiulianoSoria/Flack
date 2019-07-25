document.addEventListener('DOMContentLoaded', () => {

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', function() {
       
        document.querySelector('#chatroom_label').innerHTML = localStorage.getItem('room');
        if (!localStorage.getItem('username')) {
            document.querySelector('#chatroom_label').innerHTML = '';
            $('#SignUpModal').modal('show');
            localStorage.setItem('room', '');
            if (localStorage.getItem('room')) {
                socket.emit('join_chatroom', localStorage.getItem('room'));
            }
            else {
                document.getElementById('chatroom_label').innerHTML = '';
            }
        }
        else {
            document.querySelector('#username_label').innerHTML = localStorage.getItem('username');
            socket.emit('userdata', localStorage.getItem('username'));
        }
    });

    document.querySelector('#send_username').onclick = function(e) {
        // e.preventDefault();
        if ($('#username').val() !== ''){
            username = $('#username').val();
            socket.emit('connect');
            socket.emit('userdata', username);
            console.log(`${username} has logged in!`);
            if (localStorage.getItem('username') === null) {
                localStorage.setItem('username', username);
                console.log(localStorage.getItem('username'));
                document.getElementById('username_label').innerHTML = localStorage.getItem('username');
            }
            document.getElementById('logout').style.display = 'initial';
        }

        else {
            return false;
        }
        return false;
    };

    document.querySelector('#send_message').onclick = function(e) {
        e.preventDefault();
        username = localStorage.getItem('username');
        message = document.querySelector('#message').value;
        const room = localStorage.getItem('room');
        
        if (message !== '') {
            socket.emit('new_message', {
                'message': message, 
                'username': username, 
                'room': room
            });
                
            document.querySelector('#message').value = '';
            console.log(username + ': ' + message + ' in room ' + room);
            // return false;
        }
    };

    socket.on('join_chatroom', function(data) {
        localStorage.setItem('room', data['room']);
        // document.querySelector('#msg_history').innerHTML = '';
        document.querySelector('#chatroom_label').innerHTML = data['room'];
        var i;
        for (i in data["messages"]) {
            if (data['messages'][i].username !== localStorage.getItem('username')) {
            const li = document.createElement('li');
                li.innerHTML = `<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg"><p><strong>${data['messages'][i].username}:</strong><br>${data['messages'][i].message}</p><span class="time_date">${data['messages'][i].my_time}</span></div></div></div>`;
                document.querySelector("#msg_history").append(li);
            }
            else {
                const li = document.createElement('li');
                li.innerHTML = `<div class="outgoing_msg"><div class="sent_msg"><p><strong>${data['messages'][i].username}:</strong><br>${data['messages'][i].message}</p><span class="time_date">${data['messages'][i].my_time}</span> </div></div>`;
                document.querySelector("#msg_history").append(li);
            }
        }
    });

    socket.on('new_message', function(data) {
        console.log(`Message received!`);
        if (data !== null) {
            if (data.username === localStorage.getItem('username')){
                const li = document.createElement('li');
                li.innerHTML = `<div class="outgoing_msg"><div class="sent_msg"><p><strong>${data.username}:</strong><br>${data.message}</p><span class="time_date">${data.my_time}</span> </div></div>`;
                document.querySelector("#msg_history").append(li);
            }
            else {
                const li = document.createElement('li');
                li.innerHTML = `<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg"><p><strong>${data.username}:</strong><br>${data.message}</p><span class="time_date">${data.my_time}</span></div></div></div>`;
                document.querySelector("#msg_history").append(li);
            }
        }
    });

    $('#new_room').on('click', function(e) {
        $('#NewRoomModal').modal('show');
        return false;
    });

    document.querySelector('#send_room').onclick = function() {
        let room = document.querySelector('#room_name').value;
        
        socket.on('chatroom_error', function(msg) {
            alert(msg);
        });
        
        if (room !== '') {
            socket.emit('chatroom_creation', room);
            const li = document.createElement('li');
            li.setAttribute('class','my_room');
            li.setAttribute('data-room',`${room}`);
            li.innerHTML = `${room}`;
            document.querySelector("#change_room").append(li);
            document.querySelector('#room_name').value = '';
            // return false;
        }
        else {
            $('#NewRoomModal').modal('show');
        }
    };
    
    // $('#leave_room').on('click', function(event) {
    //     socket.emit('leave_chatroom', localStorage.getItem('room'));
    // });

    document.querySelectorAll('.my_room').forEach(function(li) {
        li.onclick = function() {
            let ul = document.querySelector('#msg_history');
            ul.innerHTML = '';
            socket.emit('change_chatroom', localStorage.getItem('room'), li.dataset.room);
            document.querySelector('#chatroom_label').innerHTML = li.dataset.room;
        };
    });


    document.getElementById('private_message_button').onclick = function() {
        $('#PrivateMessageModal').modal('show');
        return false;
    };


    document.getElementById('send_private_message').onclick = function() {
        var sender = localStorage.getItem('username');
        var recipient = document.getElementById('recipient').value;
        var message = document.getElementById('private_message').value;
        socket.emit('private_message', {
            'sender': sender,
            'recipient': recipient, 
            'message': message
        });
        document.getElementById('recipient').value = '';
        document.getElementById('private_message').value = '';
        console.log(`Private Message sent!`)
    }

    socket.on('private_message_error', function(msg) {
        alert(msg);
    });

    socket.on('private_message', function(data) {
        console.log(`${data.sender} says: ${data.message}`)
        alert(`${data.sender} says: ${data.message}`);
    });


    $('#logout').on('click', function(event) {
        socket.emit('my_disconnect_response');
        $('#username').val('');
        localStorage.setItem('username', '');
        document.getElementById('logout').style.display = 'none';
        console.log('You are disconnected!')
        
        $('#SignUpModal').modal('show');
        document.getElementById('username_label').innerHTML = '';
        return false;
    });

});
