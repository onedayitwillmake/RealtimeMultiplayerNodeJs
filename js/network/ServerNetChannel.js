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

	/**
	 * Creates a new ServerNetChannel instance
	 * @param {RealtimeMultiplayerGame.network.ServerNetChannelDelegateProtocol} aDelegate A delegate that conforms to RealtimeMultiplayerGame.network.ServerNetChannelDelegateProtocol
	 */
	RealtimeMultiplayerGame.network.ServerNetChannel = function( aDelegate ) {
		this.clients = new SortedLookupTable();

		this.setDelegate( aDelegate );
		this.setupSocketIO();
		this.setupCmdMap();
		return this;
	};

	RealtimeMultiplayerGame.network.ServerNetChannel.prototype = {
		httpserver				: null,					// A minimal HTTP server which socket.io can listen on
		socketio 				: null,					// Socket.IO server
		clients					: null,					// SortedLookupTable
		delegate				: null,					// Should conform to ServerNetChannel delegate
		outgoingSequenceNumber	: 0,					// A unique ID for each message
		cmdMap					: {},					// Map the CMD constants to functions
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

		/**
		 * Map RealtimeMultiplayerGame.Constants.CMDS to functions
		 */
		setupCmdMap: function() {
			this.cmdMap = {};
			this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_JOINED] = this.onPlayerJoined;
		},

		/**
		 * Checks all the clients to see if its ready for a new message.
		 * If they are, have the client perform delta-compression on the worldDescription and send it off.
		 * @param gameClock		   The current (zero-based) game clock
		 * @param worldDescription A description of all the entities currently in the world
		 */
		tick: function( gameClock, worldDescription )
		{
//			if(this.__DEBUG_LAST_CLIENT) {
//				console.log("(ServerNetChannel)::sending");
//				this.__DEBUG_LAST_CLIENT.send(gameClock)
//			}
			// Send client the current world info
			this.clients.forEach( function(key, client)
			{
				// Collapse delta - store the world state
				client.compressDeltaAndQueueMessage( worldDescription, gameClock );

				// Ask if enough time passed, and send a new world update
				if ( client.canSendMessage(gameClock) ) {
					client.sendQueuedCommands(gameClock);
				}

			}, this );
		},

	// Socket.IO callbacks
		/**
		 * Callback from socket.io when a client has connected
		 * @param client
		 */
		onSocketConnection: function( clientConnection ) {

			this.__DEBUG_LAST_CLIENT = clientConnection;

			var aClient = new RealtimeMultiplayerGame.network.Client( clientConnection );

			// Send the first message back to the client, which gives them a clientid
			var connectMessage = new RealtimeMultiplayerGame.model.NetChannelMessage( ++this.outgoingSequenceNumber, aClient.getSessionId(), true, RealtimeMultiplayerGame.Constants.CMDS.SERVER_CONNECT, { gameClock: this.delegate.getGameClock() });
			connectMessage.messageTime = this.delegate.getGameClock();
			aClient.getConnection().send( connectMessage );

			// Add to our list of connected users
			this.clients.setObjectForKey( aClient, aClient.getSessionId() );
		},

		/**
		 * Callback from socket.io when a client has disconnected
		 * @param client
		 */
		onSocketClosed: function(client) {
			//console.log("onSocketClosed");
		},

		/**
		 * Callback from socket.io when a ClientNetChannel has sent us a message
		 * @param data
		 * @param connection
		 */
		onSocketMessage: function( data, connection )
		{
			console.log("onSocketMessage", data );
			var client = this.clients.objectForKey(connection.sessionId);
			//that.CMD_TO_FUNCTION[decodedMessage.cmds.cmd].apply(that, [connection, decodedMessage]);

			// Allow the client to track that data was received
			if(client) {
				client.onMessage( data );
			} else {
				console.log("(NetChannel)::onSocketMessage - no such client!");
				return;
			}

			//// Call the mapped function, always pass the connection. Also pass data if available
			if( this.cmdMap[data.cmd] )
				this.cmdMap[data.cmd].call(this, client, data);
			else
				console.log("(NetChannel)::onSocketMessage could not map '" + data.cmd + "' to function!");
		},

	////// Game callbacks
		/**
		 * Callback for when a player has joined the match.
		 * Note that joining the match, happens after connecting.
		 * For example a player might be able to connect to the match, and watch the game for a while then want to join the match
		 * @param client
		 * @param data
		 */
		onPlayerJoined: function( client, data ) {
			// Create an entity ID for this new player
			var entityID = this.delegate.getNextEntityID();
			this.delegate.shouldAddPlayer( client.getId(), data);
			client.getConnection().send( data );
		},

	// Accessors
		getNextClientID: function() { return nextClientID++ },
		/**
		 * Checks that an object contains the required methods and sets it as the delegate for this ServerNetChannel instance
		 * @param {RealtimeMultiplayerGame.network.ServerNetChannelDelegateProtocol} aDelegate A delegate that conforms to RealtimeMultiplayerGame.network.ServerNetChannelDelegateProtocol
		 */
		setDelegate: function( aDelegate ) {
			var theInterface = RealtimeMultiplayerGame.network.ServerNetChannelDelegateProtocol;
			for (var member in theInterface) {
				if ( (typeof aDelegate[member] != typeof theInterface[member]) ) {
					console.log("object failed to implement interface member " + member);
					return false;
				}
			}

			// Checks passed
			this.delegate = aDelegate;
		}
	}

	/**
	 * Required methods for the ServerNetChannel delegate
	 */
	RealtimeMultiplayerGame.network.ServerNetChannelDelegateProtocol = {
		setupCmdMap: function() {},
		shouldUpdatePlayer: function( clientID, data ) {},
		shouldAddPlayer: function( entityID, clientID, data ) {},
		shouldRemovePlayer: function( clientID ) {},
		getNextEntityID: function() {},
		getGameClock: function() {}
	}
})();