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
		clientid					:null,				// A client id is set by the server on first connect

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
		onSocketConnect: function() {
			console.log("(ClientNetChannel):onSocketConnect", this.socketio);
		},

		onSocketMessage: function( aNetChannelMessage ) {

			// This is a special command after connecting and the server OK-ing us - it's the first real message we receive
			// So we have to put it here, because otherwise e don't actually have a true client ID yet so the code below this will not work
			if(aNetChannelMessage.cmd == RealtimeMultiplayerGame.Constants.CMDS.SERVER_CONNECT) {
				this.clientid = aNetChannelMessage.id;
				return;
			}

			console.log("(ClientNetChannel):onSocketMessage", arguments);
		},

		onSocketDisconnect: function( obj ) {
			console.log("(ClientNetChannel)::onSocketDisconnect", arguments);
		},

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

			this.socketio.send(val);

			if(this.verboseMode) console.log('(NetChannel) Sending Message, isReliable', aMessageInstance.isReliable, BISON.decode(aMessageInstance.encodedSelf()));
		},

		/**
		 * Prepare a message for sending at next available time
		 * @param isReliable
		 * @param anUnencodedMessage
		 */
		addMessageToQueue: function( isReliable, aCommandConstant, payload )
		{
			// Create a command
//			var command = {};
//			// Fill in the data
//				command.cmd = aCommandConstant;
//			command.data = commandData || {};
//			composeCommand( this.config.CMDS.PLAYER_JOINED, { theme: this.theme, nickname: this.nickname } );
//			this.outgoingSequenceNumber += 1;
//
//			// Create a message
//			var messageData = {};
//			messageData.cmd = aCommandConstant;
//			messageData.data = payload;
//
//
//			var message = new RealtimeMultiplayerGame.model.NetChannelMessage( this.outgoingSequenceNumber, isReliable, anUnencodedMessage );
//			message.clientID = this.socketio.sessionid;
//
//			// Add to array the queue
//			this.messageBuffer[ this.outgoingSequenceNumber & this.MESSAGE_BUFFER_MASK ] = message;
//
//			if(isReliable) {
//				this.messageBuffer[ this.outgoingSequenceNumber & this.MESSAGE_BUFFER_MASK ] = message;
//			} else {
//				this.nextUnreliable = message;
//			}
//
//			if( this.verboseMode ) console.log('(NetChannel) Adding Message to que', this.messageBuffer[this.outgoingSequenceNumber & this.MESSAGE_BUFFER_MASK], " ReliableBuffer currently contains: ", this.reliableBuffer);
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
		canSendMessage: function ()
		{
			var isReady = (this.gameClock > this.lastSentTime + this.cl_updateRate);
			console.log( "(NetChannel) isReady: " + isReady );
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