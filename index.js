var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var credentials =
{
	hostname : 'localhost',
	username : 'chat',
	password : 'example',
	name: "chat_example",
	port : 3306
}

if(process.env.hasOwnProperty('VCAP_SERVICES')){ // running on cloud foundry
	var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
	credentials = vcap_services['p-mysql'][0].credentials;
}

var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : credentials.hostname,
	user     : credentials.username,
	password : credentials.password,
	database : credentials.name,
	port : credentials.port
});

connection.connect(function(){
	console.log("DATABASE CONNECTION ESTABLISHED");
});

connection.query("CREATE TABLE IF NOT EXISTS messages (\
				id INT NOT NULL AUTO_INCREMENT,\
				message VARCHAR(255) NOT NULL,\
				date_time TIMESTAMP DEFAULT NOW(),\
				user_name VARCHAR(255),\
				PRIMARY KEY (id))");

var messages = [];
connection.query("SELECT * FROM messages", function(err, rows, fields) {
	messages = rows;
});

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
	socket.on('updates', function(msg){
		console.log('message: ' + msg);
		messages[messages.length] = msg;
		connection.query('INSERT INTO messages SET ?', {message: msg}, function(err, result){
			if(err){
				console.log('ERROR : ', err);
			}
			else {
				io.emit('updates', result);
			}
		});
	});
	io.emit('snapshot', messages);
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
