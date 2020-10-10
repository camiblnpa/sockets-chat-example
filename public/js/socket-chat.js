var socket = io();
var params = new URLSearchParams(window.location.search);

if(!params.has('name') || !params.has('room')){
    window.location = ' index.html';
    throw new Error('Name and room are necessary');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function () {
    console.log('Connected to the server');

    socket.emit('enterChat', user, function(resp) {
        console.log('Users online:');
        console.log(resp);
    });
});

//Listen
socket.on('disconnect', function () {
    console.log('We lost the connection with the server');
});

//Send information
// socket.emit('createMessage', {
//     usuario: 'Camila',
//     mensaje: 'Hi'
// }, function (resp) {
//     console.log('server response: ', resp);
// });

//Listen information
socket.on('createMessage', function (mensaje) {
    console.log('server:', mensaje);
});

//Listen change of users (on/off)
socket.on('userList', function(users) {
    console.log(users);
});

//Private messages 
socket.on('privateMessage', function(message) {
    console.log('Private message: ' , message);
})