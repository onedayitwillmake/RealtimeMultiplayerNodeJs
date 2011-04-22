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
	// Import
	var http = require('http');
    var url = require('url');
    var fs = require('fs');
    var sys = require(process.binding('natives').util ? 'util' : 'sys');
	var io = require('./lib/Socket.IO-node');

	// Ctr
	RealtimeMultiplayerGame.ServerNetChannel = function() {
		this.initializeSocketIO();
		return this;
	};

	RealtimeMultiplayerGame.ServerNetChannel.prototype = {
		httpserver:				null,					// A minimal HTTP server which socket.io can listen on
		socketio: 				null,					// Socket.IO server

	// Methods
		/**
		 * Initializes socket.io
		 */
		initializeSocketIO: function() {
			// Create a minimal http server to listen
			this.httpserver = http.createServer(function(req, res) {});
			this.httpserver.listen(8080);
			// Start socket.io
			this.socketio = io.listen(this.httpserver);


			var that = this;
			this.socketio.on('request', function(client){ that.onSocketRequest(client) });
			this.socketio.on('connection', function(client){ that.onSocketConnection(client) });
			this.socketio.on('clientDisconnect', function(client){ that.onSocketClosed(client) });
		},

		/**
		 * Callback from socket.io when a client has connected
		 * @param client
		 */
		onSocketConnection: function(client) {
			console.log("onSocketConnection");

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
		},

		/**
		 * Callback from socket.io when a client has disconnected
		 * @param client
		 */
		onSocketClosed: function(client) {
			console.log("onSocketClosed");
		}


	}
})();