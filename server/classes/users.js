class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        let user = { id, name, room };

        //add the new user to the array
        this.users.push(user);

        return this.users;
    }

    getUser(id) {
        //only one register
        let user = this.users.filter(user => user.id === id)[0];
        return user;
    }

    getUsers() {
        return this.users;
    }

    getUsersChats(room) {
        let chatUsers = this.users.filter(user => user.room === room);
        return chatUsers;
    }

    deleteUser(id) {
        let userDeleted = this.getUser(id);
        //this new array will be saved in the original array with only users online in the chat
        this.users = this.users.filter(user => user.id != id);

        return userDeleted;
    }
}

module.exports = {
    Users
}