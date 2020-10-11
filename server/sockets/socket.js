const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utils');

const users = new Users();

//when an user enter to the chat
io.on('connection', (client) => {
    client.on('enterChat', (data, callback) => {
        if (!data.name || !data.room) {
            return callback({
                status: error,
                message: 'Name/room is necessary'
            });
        }

        //add client to that room
        client.join(data.room);

        users.addUser(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('userList', users.getUsersChats(data.room));
        client.broadcast.to(data.room).emit('createMessage', createMessage('Admin', `${data.name} is joined`));

        let usersByRoom = users.getUsersChats(data.room);
        callback(usersByRoom);
    });

    client.on('createMessage', (data, callback) => {

        let user = users.getUser(client.id);

        let message = createMessage(user.name, data.message);
        client.broadcast.to(user.room).emit('createMessage', message);

        callback(message);
    });

    //when an user left the chat
    client.on('disconnect', () => {
        let userDeleted = users.deleteUser(client.id);

        client.broadcast.to(userDeleted.room).emit('createMessage', createMessage('Admin', `${userDeleted.name} is left`));

        client.broadcast.to(userDeleted.room).emit('userList', users.getUsersChats(userDeleted.room));
    });

    //private messages
    client.on('privateMessage', data => {

        let user = users.getUser(client.id);
        client.broadcast.to(data.idUser).emit('privateMessage', createMessage(user.name, data.message));
    });
});