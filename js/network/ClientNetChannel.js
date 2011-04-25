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
	var BUFFER_MASK = RealtimeMultiplayerGame.Constants.CLIENT_SETTING.MAX_BUFFER;

	// Retrieve the namespace
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.network");

	RealtimeMultiplayerGame.ClientNetChannel = function( aDelegate ) {
		this.setDelegate( aDelegate );
		this.setupSocketIO();
		return this;
	};

	RealtimeMultiplayerGame.ClientNetChannel.prototype = {
		delegate					:null,				// Object informed when ClientNetChannel does interesting stuff
		socketio					:null,
		clientid					:null,				// A client id is set by the server on first connect

		// Settings
		cl_updateRate				: RealtimeMultiplayerGame.Constants.CLIENT_SETTING.CMD_RATE,		// How often we can receive messages per sec

		// connection info
		latency						: 1000,					// Current latency time from server
		gameClock					: -1,					// Store last time from server
		lastSentTime 				: -1,                   // Time of last sent message
		lastRecievedTime 			: -1,					// Time of last recieved message

		// Data
		messageBuffer						: [],		// Store last N messages to be sent
		outgoingSequenceNumber				: 0,
		incomingWorldUpdateBuffer			: [],		// Store last N received WorldDescriptions
		reliableBuffer						: null,		// We sent a 'reliable' message and are waiting for acknowledgement that it was sent


		setupSocketIO: function() {

		    this.socketio = new io.Socket(null, {port: RealtimeMultiplayerGame.Constants.SERVER_SETTING.SOCKET_PORT, transports:["websocket"], reconnect: false, rememberTransport: false});
			this.socketio.connect();

			var that = this;
			this.socketio.on('connect', function(){ that.onSocketConnect() });
			this.socketio.on('message', function( obj ){ console.log("B"); that.onSocketDidAcceptConnection( obj ) });
			this.socketio.on('disconnect', function( obj ){ that.onSocketDisconnect( obj ) });
		},

	///// SocketIO Callbacks
		onSocketConnect: function() {
			console.log("(ClientNetChannel):onSocketConnect", arguments, this.socketio);
		},

		/**
		 * Called when ServerNetChannel has accepted your connection and given you a client id
		 * This is only called once, use the info to set some properties
		 */
		onSocketDidAcceptConnection: function(  aNetChannelMessage ) {

			console.log("(ClientNetChannel)::onSocketDidAcceptConnection", aNetChannelMessage);

			// We don't actually have a true client ID yet so the code below this will not work
			if(aNetChannelMessage.cmd != RealtimeMultiplayerGame.Constants.CMDS.SERVER_CONNECT) {
				throw "(ClientNetChannel):onSocketDidAcceptConnection recieved but cmd != SERVER_CONNECT ";
				return;
			}

			this.clientid = aNetChannelMessage.id;
			this.delegate.netChannelDidConnect( aNetChannelMessage );

			// Set onMessage function back to normal - removing event listener didn't work, so for now changing the mapping
			// TODO: Do via removeEvent
			//this.socketio.removeEvent("message", function( obj ){ that.onSocketDidAcceptConnection( obj ) });
			//this.socketio.on('message', function( obj ){ that.onSocketMessage( obj ) });
			this.onSocketDidAcceptConnection = this.onSocketMessage;
		},

		/**
		 * Called when Socket.io has received a new message
		 * @param aNetChannelMessage
		 */
		onSocketMessage: function( aNetChannelMessage ) {
			console.log("(ClientNetChannel):onSocketMessage", arguments);
		},

		onSocketDisconnect: function( obj ) {
			console.log("(ClientNetChannel)::onSocketDisconnect", arguments);
		},


		tick: function( ) {
			this.gameClock = this.delegate.getGameClock();

			// Can't send new message, still waiting for last imporant message to be returned
			if(this.reliableBuffer !== null) return;

			var hasReliableMessages = false;
			var firstUnreliableMessageFound = null;

			var len = this.messageBuffer.length;
			for (var i = 0; i < len; i++)
			{
				var message = this.messageBuffer[i];
				if(message.isReliable) // We have more important things to tend to sir.
				{
					hasReliableMessages = true;
					this.sendMessage(message);
					break;
				}
			}

			// No reliable messages waiting, enough time has passed to send an update
			if(!hasReliableMessages && this.canSendMessage() && this.nextUnreliable != null)
			{
				this.sendMessage( this.nextUnreliable )
			}
		},

		/**
		 * Sends a message via socket.io
		 * @param aMessageInstance
		 */
		sendMessage: function( aMessageInstance ) {
			if(this.socketio == undefined) {
				console.log("(ClientNetChannel)::sendMessage - socketio is undefined!");
				return;
			}

			if(!this.socketio.connected) { // Socket.IO is not connectd, probably not ready yet
				// console.log("(ClientNetChannel)::sendMessage - socketio is undefined!");
				return;      //some error here
			}

			aMessageInstance.messageTime = this.delegate.getGameClock(); // Store to determine latency

			this.lastSentTime = this.gameClock;

			if( aMessageInstance.isReliable ) {
				this.reliableBuffer = aMessageInstance; // Block new connections
			}

			this.socketio.send( aMessageInstance );

			if( RealtimeMultiplayerGame.Constants.CLIENT_NETCHANNEL_DEBUG ) console.log('(NetChannel) Sending Message, isReliable', aMessageInstance.isReliable, aMessageInstance);
		},

		/**
		 * Prepare a message for sending at next available time
		 * @param isReliable
		 * @param anUnencodedMessage
		 */
		addMessageToQueue: function( isReliable, aCommandConstant, payload ) {
			// Create a NetChannelMessage
			var message = new RealtimeMultiplayerGame.model.NetChannelMessage( this.outgoingSequenceNumber, this.clientID, isReliable, aCommandConstant, payload );

			// Add to array the queue using bitmask to wrap values
			this.messageBuffer[ this.outgoingSequenceNumber & BUFFER_MASK ] = message;

			if(isReliable) {
				this.nextUnreliable = message;
			}

			++this.outgoingSequenceNumber;
			if( RealtimeMultiplayerGame.Constants.CLIENT_NETCHANNEL_DEBUG ) console.log('(NetChannel) Adding Message to queue', this.messageBuffer[this.outgoingSequenceNumber & BUFFER_MASK], " ReliableBuffer currently contains: ", this.reliableBuffer);
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
		setDelegate: function( aDelegate ) {
			var theInterface = RealtimeMultiplayerGame.ClientNetChannelDelegateProtocol;
			for (var member in theInterface) {
				if ( (typeof aDelegate[member] != typeof theInterface[member]) ) {
					console.error("object failed to implement interface member " + member);
					return false;
				}
			}

			// Checks passed
			this.delegate = aDelegate;
		},

		/**
		* Determines if it's ok for the client to send a unreliable new message yet
		*/
		canSendMessage: function () {
			var isReady = (this.gameClock > this.lastSentTime + this.cl_updateRate + 10000) ;
		}
	}

	/**
	 * Required methods for the ClientNetChannel delegate
	 */
	RealtimeMultiplayerGame.ClientNetChannelDelegateProtocol = {
		netChannelDidConnect: function() {},
		netChannelDidReceiveMessage: function( aMessage ) {},
		netChannelDidDisconnect: function() {},
		getGameClock: function() {}
	}
})()