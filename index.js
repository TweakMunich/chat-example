var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var messages = ["Hello World", "Have a good chat!"];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
	socket.on('updates', function(msg){
		console.log('message: ' + msg);
		messages[messages.length] = msg;
		io.emit('updates', msg);
	});
	io.emit('snapshot', messages);
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:' + process.env.PORT);
});