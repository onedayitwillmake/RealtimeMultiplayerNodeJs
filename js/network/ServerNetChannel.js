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
	// Node.JS Imports
	var http = require('http');
    var url = require('url');
    var fs = require('fs');
    var sys = require(process.binding('natives').util ? 'util' : 'sys');
	var io = require('../lib/Socket.IO-node');

	// Local variables for private things in this class
	var nextClientID = 0;

	// Retrieve the namespace
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.network");

	// Ctr
	RealtimeMultiplayerGame.network.ServerNetChannel = function( aDelegate ) {
		this.clients = new SortedLookupTable();
		this.setDelegate( aDelegate );
		this.setupSocketIO();
		return this;
	};

	RealtimeMultiplayerGame.network.ServerNetChannel.prototype = {
		httpserver				: null,					// A minimal HTTP server which socket.io can listen on
		socketio 				: null,					// Socket.IO server
		clients					: null,					// SortedLookupTable
		delegate				: null,					// Should conform to ServerNetChannel delegate
		outgoingSequenceNumber	: 0,					// A unique ID for each message

	// Methods
		/**
		 * Initializes socket.io
		 */
		setupSocketIO: function() {
			// Create a minimal http server to listen
			this.httpserver = http.createServer(function(req, res) {});
			this.httpserver.listen( RealtimeMultiplayerGame.Constants.SERVER_SETTING.SOCKET_PORT );
			// Start socket.io
			this.socketio = io.listen(this.httpserver);


			var that = this;
			this.socketio.on('request', function(client){ that.onSocketRequest(client) });
			this.socketio.on('connection', function(client){ that.onSocketConnection(client) });
			this.socketio.on('clientMessage', function(data, client){ that.onSocketMessage( data, client ) });
			this.socketio.on('clientDisconnect', function(client){ that.onSocketClosed(client) });
		},

	// Socket.IO callbacks
		/**
		 * Callback from socket.io when a client has connected
		 * @param client
		 */
		onSocketConnection: function( clientConnection ) {
			var aClient = new RealtimeMultiplayerGame.network.Client( clientConnection );


			// Setup callbacks
			var that = this;

			//RealtimeMultiplayerGame.model.NetChannelMessage = function(aSequenceNumber, isReliable, anUnencodedMessage)
			//this.getNextClientID()
			var connectMessage = new RealtimeMultiplayerGame.model.NetChannelMessage( ++this.outgoingSequenceNumber, aClient.getSessionID(), true, RealtimeMultiplayerGame.Constants.CMDS.SERVER_CONNECT, { gameClock: this.delegate.getGameClock() });
			connectMessage.messageTime = that.delegate.getGameClock();
//			client.on('message', function(message){
//			aClient.getConnection().on('message', function( aMessage ) { that._onClientMessage( )

			// Add to our list of connected users
			this.clients.setObjectForKey( aClient, aClient.getSessionID() );
			aClient.getConnection().send( connectMessage );
		},

		/**
		 * Callback from socket.io when a client has disconnected
		 * @param client
		 */
		onSocketClosed: function(client) {
			console.log("onSocketClosed");
		},

		onSocketMessage: function( data, client )
		{

			 console.log("onClientMessage", data, client);
//			client.on('message', function(message){
//			var msg = { message: [client.sessionId, message] };
//			buffer.push(msg);
//			if (buffer.length > 15) buffer.shift();
//			client.broadcast(msg);
//		  });
//
//		  client.on('disconnect', function(){
//			client.broadcast({ announcement: client.sessionId + ' disconnected' });
//		  });
		},

	// Accessors
		getNextClientID: function() { return nextClientID++ },
		setDelegate: function( aDelegate ) {
			this.delegate = aDelegate;
		}
	}
})();