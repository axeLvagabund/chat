var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

var rooms = [],
	users = [];

app.use(express.static(__dirname));
app.get('/', function(req, res) {
	res.sendFile('index.html');
});



io.on('connection', function(socket) {
	socket.on('sendNickname', function(username) {
		socket.username = username;
		users.push(socket.username);
		socket.emit('showRooms', rooms);
	});

	socket.on('disconnect', function() {
		socket.broadcast.to(socket.room).emit('notice', socket.username + ' has left from CHAT');
		socket.leave(socket.room);
		if(typeof socket.adapter.rooms[socket.room] === 'undefined' || typeof Object.keys(socket.adapter.rooms[socket.room]) !== 'object') {
			console.log('Room must be deleted');
			// io.emit('deleteRoomFromList', socket.room);
			rooms.splice(rooms.indexOf(socket.room), 1);
		};
		io.emit('showRooms', rooms);
		users.splice(users.indexOf(socket.username), 1);
	});

	socket.on('message', function(data) {
		socket.broadcast.to(socket.room).emit('message', data);
	});

	socket.on('createRoom', function(room) {
		socket.leave(socket.room);
		socket.room = room;
		rooms.push(socket.room);
		// io.emit('addRoom', room);
		io.emit('showRooms', rooms);
		socket.join(socket.room);
	});

	socket.on('connectToRoom', function(room) {
		socket.leave(socket.room);
		socket.room = room;
		socket.join(socket.room);
		socket.broadcast.to(socket.room).emit('notice', socket.username + ' has joined to room');
	});

	socket.on('leaveFromRoom', function() {
		socket.broadcast.to(socket.room).emit('notice', socket.username + ' has left the room');
		socket.leave(socket.room);
		if(typeof socket.adapter.rooms[socket.room] === 'undefined' || typeof Object.keys(socket.adapter.rooms[socket.room]) !== 'object') {
			console.log('Room must be deleted');
			// io.emit('deleteRoomFromList', socket.room);
			rooms.splice(rooms.indexOf(socket.room), 1);
		};
		io.emit('showRooms', rooms);
	});
});



http.listen(process.env.PORT || 3000, function() {
	console.log('Server is running on 127.0.0.1:3000');
});