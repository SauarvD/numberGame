var express = require('express'); 					//referenced the express module, which is a web framework that will help us render our static files.
var app = express(); 								//created a new instance of express and called it  app.
var server = require('http').Server(app); 			//supplied the app to the HTTP server, which will allow express to handle the HTTP requests.

var io = require('socket.io').listen(server);
var players = {};

app.use(express.static(__dirname + '/public')); 	//updated the server to render our static files using  express.static built-in middleware function in Express.

app.get('/', function (req, res) {					//told the server to serve the  index.html file as the root page.
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	console.log('a user connected');

	socket.emit('message', 'you are on');

  	// create a new player and add it to our players object
	// players[socket.id] = {
	//   playerId: socket.id,
	const playerId = socket.id;
	socket.emit('onLoad',playerId);
	// };
	// // send the players object to the new player
	// socket.emit('currentPlayers', players);
	// update all other players of the new player
	// socket.broadcast.emit('newPlayer', players[socket.id]);
	socket.on('name', (name)=>{
		players[socket.id] = {
			playerId: name
		}
		io.emit('nameSubmitted',players[socket.id]);
	})

	socket.on('clickDiv', (id) =>{
		io.emit('colorDiv',id,players[socket.id]);
	})

  socket.on('disconnect', function () {
    console.log('user disconnected');

    // remove this player from our players object
	delete players[socket.id];
	// emit a message to all players to remove this player
	io.emit('disconnect', socket.id);
  });
});


server.listen(1234, function () {					// had the server start listening on port 1234.
  console.log(`Listening on ${server.address().port}`);
});