var socket = io();

var username = prompt('What\'s your name ?'),
	newMessage = function(data) {
		$('#messages').append($('<li>').append($('<span class="who">').text(data.username + ": ")).append($('<span class="message">').text(data.message)));
	};

socket.emit('sendNickname', username);

$('#chatForm').submit(function() {
	var data = { message: $('#messageText').val(), username: username };
	socket.emit('message', data);
	newMessage(data);
	$('#messageText').val('');
	return false;
});

$('#roomForm').submit(function() {
	socket.emit('createRoom', $('#roomName').val());
	$('#messages').empty();
	$('#roomName').val('');
	$('#roomForm').hide();
	$('#chatForm').show();
	return false;
});

socket.on('message', function(data) {
	newMessage(data);
});

socket.on('showRooms', function(rooms) {
	$('#rooms').empty();
	for(var i = 0; i < rooms.length; i++) {
		$('#rooms').append($('<li>')
					.append($('<span class="freeRoom">').text(rooms[i])));
	};
});
// socket.on('deleteRoomFromList', function(room) {
// 	console.log('client is work');
// 	$('#rooms').find('.freeRoom').text(room).parent().remove();
// });
// socket.on('addRoom', function(room) {
// 	console.log('add room');
// 	$('#rooms').append($('<li>')
// 					.append($('<span class="freeRoom">').text(room)));
// });

$('ul#rooms').on("click", 'li', function() {
	socket.emit('connectToRoom', $(this).find('.freeRoom').text());
	$('#messages').empty();
	$('#roomForm').hide();
	$('#chatForm').show();
});

$('#leaveFromRoom').on('click', function() {
	socket.emit('leaveFromRoom');
	$('#chatForm').hide();
	$('#roomForm').show();
});

socket.on('notice', function(message) {
	$("#messages").append($('<li>').text(message));
});