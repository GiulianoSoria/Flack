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
            if (localStorage.getItem('username') === '') {
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
        
        socket.emit('new_message', {
            'message': message, 
            'username': username, 
            'room': room
        });
            
        document.querySelector('#message').value = '';
        console.log(username + ': ' + message + ' in room ' + room);
        // return false;
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
            // const li = document.createElement('li');
            // li.innerHTML = `<strong>${data["messages"][i].username}:</strong> <div><span>${data["messages"][i].message}</span></div> <small>(${data["messages"][i].my_time})</small>`;
            // document.querySelector("#msg_history").append(li);
        // }
    });

    socket.on('chatroom_error', function(msg) {
        alert(msg);
    });


    socket.on('new_message', function(data) {
        console.log(`Message received!`);
        // socket.emit('new_message', data);
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

        // const li = document.createElement('li');
        // li.innerHTML = `<strong>${data.username}:</strong> <div><span>${data.message}</span></div> <small>(${data.my_time})</small>`;
        // document.querySelector("#msg_history").append(li);
    });

    $('#new_room').on('click', function(e) {
        $('#NewRoomModal').modal('show');
        return false;
    });

    document.querySelector('#send_room').onclick = function() {
        let room = document.querySelector('#room_name').value;
        // if (room !== '') {
            socket.emit('chatroom_creation', room);
        //     localStorage.setItem('room', room);
        //     console.log(`${room} created!`);
        //     $('#room_name').val('');
        //     $('#NewRoomModal').modal('hide');
        //     document.querySelector('#chatroom_label').innerHTML = room;
            // socket.emit('join_chatroom', room);
            const li = document.createElement('li');
            li.setAttribute('class','my_room');
            li.setAttribute('data-room',`${room}`);
            li.innerHTML = `${room}`;
            document.querySelector("#change_room").append(li);
            document.querySelector('#room_name').value = '';
            // return false;
        // }
        // else {
        //     $('#NewRoomModal').modal('show');
        // }
    };
    
    // $('#leave_room').on('click', function(event) {
    //     socket.emit('leave_chatroom', localStorage.getItem('room'));
    // });

    document.querySelectorAll('.my_room').forEach(function(li) {
        li.onclick = function() {
            // const username = localStorage.getItem('username');
            let ul = document.querySelector('#msg_history');
            ul.innerHTML = '';
            if (localStorage.getItem('room') !== li.datasetroom) {
                socket.emit('change_chatroom', localStorage.getItem('room'), li.dataset.room);
                document.querySelector('#chatroom_label').innerHTML = li.dataset.room;
            }
            else {
                document.querySelector('#chatroom_label').innerHTML = li.dataset.room;
            }
            
            // socket.on('join_chatroom', function(data) {
            //     localStorage.setItem('room', li.dataset.room);
            //     // document.querySelector('#chatroom_label').innerHTML = data['room'];
            //     if (data.room === li.dataset.room) {
            //         var i;
            //         for (i in data["messages"]) {
            //             if (data['messages'][i].username !== username) {
            //                 const li = document.createElement('li');
            //                 li.innerHTML = `<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg"><p><strong>${data['messages'][i].username}:</strong><br>${data['messages'][i].message}</p><span class="time_date">${data['messages'][i].my_time}</span></div></div></div>`;
            //                 document.querySelector("#msg_history").append(li);
            //             }
            //             else {
            //                 const li = document.createElement('li');
            //                 li.innerHTML = `<div class="outgoing_msg"><div class="sent_msg"><p><strong>${data['messages'][i].username}:</strong><br>${data['messages'][i].message}</p><span class="time_date">${data['messages'][i].my_time}</span> </div></div>`;
            //                 document.querySelector("#msg_history").append(li);
            //             }
            //         }
            //     }
            // });
            // socket.on('join_chatroom', function(data) {
            //     // localStorage.setItem('room', data['room']);
            //     // document.querySelector('#msg_history').innerHTML = '';
            //     // document.querySelector('#chatroom_label').innerHTML = data['room'];
            //     var i;
            //     for (i in data["messages"]) {
            //     //     if (data['messages'][i].username !== localStorage.getItem('username')) {
            //     //     const li = document.createElement('li');
            //     //         li.innerHTML = `<div class="incoming_msg"><div class="received_msg"><div class="received_withd_msg"><p><strong>${data['messages'][i].username}:</strong><br>${data['messages'][i].message}</p><span class="time_date">${data['messages'][i].my_time}</span></div></div></div>`;
            //     //         document.querySelector("#msg_history").append(li);
            //     //     }
            //     //     else {
            //     //         const li = document.createElement('li');
            //     //         li.innerHTML = `<div class="outgoing_msg"><div class="sent_msg"><p><strong>${data['messages'][i].username}:</strong><br>${data['messages'][i].message}</p><span class="time_date">${data['messages'][i].my_time}</span> </div></div>`;
            //     //         document.querySelector("#msg_history").append(li);
            //     //     }
            //     // }
            //         const li = document.createElement('li');
            //         li.innerHTML = `<strong>${data["messages"][i].username}:</strong> <div><span>${data["messages"][i].message}</span></div> <small>(${data["messages"][i].my_time})</small>`;
            //         document.querySelector("#msg_history").append(li);
            //     }
            // });
        };
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
