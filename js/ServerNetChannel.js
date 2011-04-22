/**
File:
	ServerNetChannel.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS
Abstract:
	This class is responsible for managing the socket connection for each client

 	-> ClientNetChannel talks to this object
	<--> ServerNetChannel talks to it's GameController via delegation
 	  <-- ServerNetChannel broadcast the message to all clients

Basic Usage:
 	TODO: UPDATE USAGE
Version:
	1.0
*/
(function(){
	RealtimeMultiplayerGame.ServerNetChannel = function() {
		return this;
	};

	RealtimeMultiplayerGame.ServerNetChannel.prototype = {

		/**
		 * Initializes socket.io
		 */
		initializeSocketIO: function() {
			// Create a minimal http server to listen
			var server = http.createServer(function(req, res) {
			});
			server.listen(8080);

			// socket.io, I choose you
			// simplest chat application evar
			var io = io.listen(server);
			var buffer = [];
			io.on('connection', function(client) {
				console.log(client.sessionId);
				client.send({ buffer: buffer });
				client.broadcast({ announcement: client.sessionId + ' connected' });
				client.on('message', function(message) {
					var msg = { message: [client.sessionId, message] };
					buffer.push(msg);
					if (buffer.length > 15) buffer.shift();
					client.broadcast(msg);
				});
				client.on('disconnect', function()
				{
					client.broadcast({ announcement: client.sessionId + ' disconnected' });
				});
			});
		}

	}
})();