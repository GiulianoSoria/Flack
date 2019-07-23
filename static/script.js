// We check if a user is logged in or not
if (!localStorage.getItem('username')) {
    user = localStorage.setItem('username', '');
}

// document.getElementById("start").style.display = "initial";
// document.getElementById("status").style.display = "none";
// document.getElementById("status-icon").style.display = "none";
// document.getElementById("room").style.display = "none";
// document.getElementById("create").style.display = "none";

document.addEventListener('DOMContentLoaded', () => {

    // Connect to websockets
    var socket = io.connect('http://' + document.domain + ':' + location.port); //General websocket
    var socket_user = io.connect('http://' + document.domain + ':' + location.port + '/user');
    var socket_chat = io.connect('http://' + document.domain + ':' + location.port + '/chat'); //Chat websocket
    

    document.getElementById('username').innerHTML = localStorage.getItem('username')
    username = localStorage.getItem('username')

    if (localStorage.getItem('username') != '') {
        alert(`Hello ${username}! I hope you are having a great day!`);
        socket_user.emit('session', username);
        console.log(`${username} is connected!`)

        // document.getElementById("status").style.display = "initial";
        // document.getElementById("status-icon").style.display = "initial";
        // document.getElementById("room").style.display = "initial";
        // document.getElementById("create").style.display = "initial";
    }
    else {
        socket.emit('my event', {
            data: `Nobody is connected`
        });
        console.log('Nobody is connected!');
    }
    

    socket_user.on($('#start').click(function() {
        if (document.getElementById('username').innerHTML == '') {
            do {
                var username = prompt("Please, insert your username: ", "");
            }
            while (username == null || username == "");

            alert("Hello " + username + "! I hope you are having a great day!");
        }
        else {
            return false;
        }
            
        document.getElementById('username').innerHTML = username;
        localStorage.setItem('username', username);
        // document.getElementById("create").style.display = "initial";
        // document.getElementById("status").style.display = "initial";
        // document.getElementById("status-icon").style.display = "initial";
        // document.getElementById("room").style.display = "initial";
        // document.getElementById("create").style.display = "initial";

        socket_user.emit('session', username);
        console.log(`${username} is connected!`);   
        
        return false;
        
    }));

    socket_user.on($('#signout').click(function() {
        if (document.getElementById('username').innerHTML == '') {
            return false;
        }
        else {
            username = localStorage.getItem('username');
            localStorage.setItem('username', '');
            document.querySelector('#username').innerHTML = localStorage.getItem('username');
            // document.getElementById("status").style.display = "none";
            // document.getElementById("status-icon").style.display = "none";
            // document.getElementById("room").style.display = "none";
            // document.getElementById("create").style.display = "none";

            alert(`${username}, you are disconnected!`);


            socket_user.emit('my event', {
                data: `${username} is disconnected`
            });
            console.log(`${username} is disconnected!`);

            return false;
        }
    }));

    socket_chat.on($('#create').click(function(e, data) {
        username = localStorage.getItem('username');
        // document.getElementById("create").style.display = "initial";
        // document.getElementById("status").style.display = "initial";
        // document.getElementById("status-icon").style.display = "initial";
        // document.getElementById("room").style.display = "initial";
        // document.getElementById("create").style.display = "initial";
        
        room = $('#room').val();
        if (room == "") {
            alert(`You must enter a valid name for the room name!`);
            return false;
        }
        else {
        data.username = username;
        data.room = room;
        socket_chat.emit('join', {
            data: `${username} has created the room ${room}`
        });
        console.log(`${username} has created the room ${room}`);
        }
        alert(`You have joined the room ${room}`);
        
        socket_chat.on('join', function(data) {
            data.room = $('#room').val();
            data.username = username;
        });
        e.preventDefault();
        

        
    }));
    // document.querySelector('#start').onclick = () => {
    //     if (document.getElementById('username').innerHTML == '') {
    //         do {
    //             var username = prompt("Please, insert your username: ", "");
    //         }
    //         while (username == null || username == "");

    //         alert("Hello " + username + "! I hope you are having a great day!");
            
    //         document.getElementById('username').innerHTML = username;
    //         localStorage.setItem('username', username);
    //         document.getElementById("create").style.display = "initial";
    //         document.getElementById("status").style.display = "initial";
    //         document.getElementById("status-icon").style.display = "initial";

    //         return false;
    //     }
    //     socket.on('connection', () => {
    //         username = document.querySelector('#username').innerHTML;
    //         if (username === '') {
    //             socket.emit('my event', {
    //                 data: `Nobody is connected`
    //             });
    //             console.log('Nobody is connected!');
    //         }
    //         else {
    //             socket.emit('my event', {
    //                 data: `${username} connected`
    //             });
    //             console.log(`${username} is connected!`);
    
    //             socket.on('disconnect', () => {
    //                 socket.emit('my event', {
    //                     data: `${username} is disconnected`
    //                 });
    //                 console.log(`${username} is disconnected!`)
    //             });
    //         }
    //     }); 
    // }
    
    // document.querySelector('#signout').onclick = () => {
    //     localStorage.setItem('username', '');
    //     document.querySelector('#username').innerHTML = localStorage.getItem('username');
    //     document.getElementById("status").style.display = "none";
    //     document.getElementById("status-icon").style.display = "none";

    //     return false;
    // }

    // socket.on('connect', () => {
    //     username = document.querySelector('#username').innerHTML;
    //     if (username === '') {
    //         socket.emit('my event', {
    //             data: `Nobody is connected`
    //         });
    //         console.log('Nobody is connected!');
    //     }
    //     else {
    //         socket.emit('my event', {
    //             data: `${username} connected`
    //         });
    //         console.log(`${username} is connected!`);

    //         socket.on('disconnect', () => {
    //             socket.emit('my event', {
    //                 data: `${username} is disconnected`
    //             });
    //             console.log(`${username} is disconnected!`)
    //         });
    //     }
        

        // socket.on('join', data => {
        //     document.querySelector('#create').onclick = () => {
        //         data.username = document.querySelector('#username').innerHTML;
        //         data.room = prompt("Give a name to the room: ", "");;
        //     }

        //     var form = $('form').on('submit', function(e){
        //         e.preventDefault();
        //         let name = document.getElementById('username').innerHTML;
        //         let text = document.getElementById('message').innerHTML;
        //         socket.emit('my event', {
        //             username: name,
        //             message: text
        //         });
        //         $('input.message').val().focus();
        //     });
    
    
        //     socket.on('my response', function(msg){
        //         console.log(msg);
        //         if (typeof msg.name !== 'undefined'){
        //             $('h3').remove();
        //             $('<div.message_holder').append('<div><b style="color: #000">' + msg.name + '</b>' + msg.text + '</div>');
        //         };
        //     });


        // });

    // });

});