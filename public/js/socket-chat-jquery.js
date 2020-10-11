var params = new URLSearchParams(window.location.search);
var name = params.get('name');
var room = params.get('room');

//jQuery references
var usersDiv = $('#usersDiv');
var sendForm = $('#sendForm');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');

//this file will render the HTML
function renderUsers(users) {
    console.log(users);

    var html = '';

    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> <span>' + params.get('room') + '</span> room</a>';
    html += '</li>';

    for (var i = 0; i < users.length; i++) {
        html += '<li>'
        html += '    <a data-id="' + users[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + users[i].name + '<small class="text-success"> online </small></span></a>'
        html += '</li>'
    }

    usersDiv.html(html);
}

function renderMessages(message, me) {
    var html = '';
    var date = new Date(message.date);
    var hour = date.getHours() + ':' + date.getMinutes();

    var adminClass = 'info';

    if (message.name === 'Admin') {
        adminClass = 'danger';
    }

    if (me) {
        html += '<li class="reverse">';
        html += '   <div class="chat-content">';
        html += '       <h5>' + message.name + '</h5>';
        html += '       <div class="box bg-light-inverse">' + message.message + '</div>';
        html += '       </div>';
        html += '       <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" />';
        html += '       </div>';
        html += '   <div class="chat-time">' + hour + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (message.name !== 'Admin') {
            html += '   <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user"/></div>';
        }
        html += '   <div class="chat-content">';
        html += '       <h5>' + message.name + '</h5>';
        html += '       <div class="box bg-light-' + adminClass + '">' + message.message + '</div>';
        html += '   </div>';
        html += '   <div class="chat-time">' + hour + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//jQuery listeners
usersDiv.on('click', 'a', function () {
    //the id parameter is the name in the html <a data-id ...
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }
});

sendForm.on('submit', function (e) {
    e.preventDefault();

    if (txtMessage.val().trim().length === 0) {
        return;
    }

    socket.emit('createMessage', {
        name: name,
        message: txtMessage.val()
    }, function (message) {
        txtMessage.val('').focus();
        renderMessages(message, true);
        scrollBottom();
    });
})
