var express = require('express');
var app = express();
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
	console.log("****CONNECTION ESTABLISHED 2");
});


connection.query("CREATE TABLE IF NOT EXISTS messages (\
				id INT NOT NULL AUTO_INCREMENT,\
				message VARCHAR(255) NOT NULL,\
				date_time TIMESTAMP DEFAULT NOW(),\
				user_name VARCHAR(255),\
				PRIMARY KEY (id))");

app.use(express.static('static'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});


app.get('/resetdb', function(req, res){
	connection.query('DELETE FROM messages', function(err, results){
		if(err){
			console.log('ERROR : ', err);
		}
		else {
			console.log('Database is empty again');
			res.sendfile('index.html');
		}
	});
});

io.on('connection', function(socket){
	socket.on('updates', function(msg){
		connection.query('INSERT INTO messages SET ?',  msg, function(err, result){
			if(err){
				console.log('ERROR : ', err);
			}
			else {
				connection.query('SELECT * FROM messages WHERE id = ?', [result.insertId], function(err, results){
					if(err){
						console.log('ERROR : ', err);
					}
					else {
						io.emit('updates', results[0]);
					}
				});
			}
		});
	});
	
	//Loading messages
	connection.query("SELECT * FROM messages", function(err, rows, fields) {
		io.emit('snapshot', rows);
	});
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
