/**
File:
	ClientNetChannel.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS
Abstract:
	Communicates with the server and stores rolling world-entity-descriptions

 	-> GameController talks to this object
	<--> ClientNetChannel waits to be ready, when it is
 	  <-- ClientNetChannel talks to the ServerNetChannel
 	   <--> ServerNetChannel does some stuff
	     --> ServerNetChannel talks to ClientNetChannel
		  --> ClientNetChannel talks to the GameController  --^

Basic Usage:
 	Create an object that conforms to the following protocol
 	netChannelDidConnect();
 	netChannelDidReceiveMessage();
 	netChannelDidDisconnect();
Version:
	1.0
*/
(function(){

	RealtimeMultiplayerGame.ClientNetChannel = function( aDelegate ) {
		this.setDelegate( aDelegate );
		this.setupSocketIO();
		return this;
	};

	RealtimeMultiplayerGame.ClientNetChannel.prototype = {
		delegate					:null,				// Object informed when ClientNetChannel does interesting stuff
		socketio					:null,

		// Settings
		cl_updateRate				: RealtimeMultiplayerGame.Constants.CLIENT_SETTING.CMD_RATE,		// How often we can receive messages per sec

		// connection info
		latency						: 1000,					// Current latency time from server
		lastSentTime 				: -1,                   // Time of last sent message
		lastRecievedTime 			: -1,					// Time of last recieved message

		// Data
		messageBuffer						: [],		// Store last N messages to be sent
		incomingWorldUpdateBuffer			: [],		// Store last N received WorldDescriptions


		setupSocketIO: function() {

		    this.socketio = new io.Socket(null, {port: RealtimeMultiplayerGame.Constants.SERVER_SETTING.SOCKET_PORT, transports:["websocket"], rememberTransport: false});
			this.socketio.connect();

			var that = this;
			this.socketio.on('connect', function( obj ){ that.onSocketConnect( obj ) });
			this.socketio.on('message', function( obj ){ that.onSocketMessage( obj ) });
			this.socketio.on('disconnect', function( obj ){ that.onSocketDisconnect( obj ) });
		},

		///// SocketIO Callbacks
		onSocketConnect: function( obj ) {

		},

		onSocketMessage: function( obj ) {

		},

		onSocketDisconnect: function( obj ) {

		},

		sendMessage: function( aMessageInstance ) {
			if(this.connection == undefined) {
				console.log("connection is undefined!");
				return;

			}

			if(this.connection.readyState == WebSocket.CLOSED) {
				return;      //some error here
			}
			aMessageInstance.messageTime = this.delegate.getGameClock(); // Store to determine latency

			this.lastSentTime = this.gameClock;

			if( aMessageInstance.isReliable ) {
				this.reliableBuffer = aMessageInstance; // Block new connections
			}

			this.socketio.send(val);

			if(this.verboseMode) console.log('(NetChannel) Sending Message, isReliable', aMessageInstance.isReliable, BISON.decode(aMessageInstance.encodedSelf()));
		},

		adjustRate: function() {
			var deltaTime = this.gameClock - serverMessage.gameClock;
			this.latency = deltaTime;

			// TODO: Adjust cl_updateRate based on message thruput
			//		time -= 100; // Subtract 100ms
	//		if(this.)
	//		console.log('Time:', time)
			// time -= 0.1; // subtract 100ms
			//
			// if(time <= 0)
			// {
			// 	this.rate = 0.12; /* 60/1000*2 */
			// }
			// else
			// {
			// }
		},

	///// Memory
		/**
		 * Clear memory
		 */
		dealloc: function() {
			this.connection.close();
			delete this.connection;
			delete this.messageBuffer;
			delete this.incomingWorldUpdateBuffer;
		 },

	///// Accessors
		/**
		 * Set the NetChannelDelegate after validation
		 * @param aDelegate
		 */
		setDelegate: function( aDelegate )
		{
			var isValid = false; // Assume false

			if(aDelegate &&  aDelegate.netChannelDidConnect && aDelegate.netChannelDidReceiveMessage && aDelegate.netChannelDidDisconnect && aDelegate.getGameClock ) {
				isValid = true;
			} else {
				throw "(ClientNetChannel): Object does not conform to required ClientNetChannel delegate methods";
			}

			return isValid;
		},

		/**
		* Determines if it's ok for the client to send a unreliable new message yet
		*/
		canSendMessage: function ()
		{
			var isReady = (this.gameClock > this.lastSentTime + this.cl_updateRate);
			console.log( "(NetChannel) isReady: " + isReady );
		}

	}
})()