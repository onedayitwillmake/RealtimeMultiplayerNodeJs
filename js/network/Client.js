/**
File:
	AbstractServerGame.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS
Abstract:
	This class is the base Game controller in RealtimeMultiplayerGame on the server side.
 	It provides things such as dropping players, and contains a ServerNetChannel
Basic Usage:
 	[This class is not instantiated! - below is an example of using this class by extending it]

 	(function(){
		MyGameClass = function() {
			return this;
 		}

		RealtimeMultiplayerGame.extend(MyGameClass, RealtimeMultiplayerGame.AbstractServerGame, null);
	};
Version:
	1.0
*/
(function(){
	// Retrieve the namespace
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.network");

	RealtimeMultiplayerGame.network.Client = function( aConnection ) {
		this.connection = aConnection;
		return this;
	};

	RealtimeMultiplayerGame.AbstractServerGame.prototype = {
		connection				: null,				// SocketIO connection for this specific client

		// Configuration
		cl_updateRate			: RealtimeMultiplayerGame.Constants.CLIENT_SETTING.UPDATE_RATE,		// How often we can receive messages per sec
		outgoingMessageBuffer	: [],				// Store array of incoming messages, slots are resused
		outgoingSequenceNumber	: 0,                // Number of total outgoing messages received
		incomingMessageBuffer	: [],              	// Store array of incoming messages, slots are resused
		incomingSequenceNumber	: 0,                // Number of total incoming messages received

		// Used to track if we can send a new message to this user
		lastSentMessageTime 	: -1,
		lastReceivedMessageTime : -1,

		/**
		 * Returns true if its ok to send this client a new message
		 * @param {Number} gameClock
		 */
		canSendMessage: function( gameClock ) {
			return (gameClock - this.lastSentMessageTime) > this.cl_updateRate;
		}
	}
})();

/**
File:
	Client.js
Created By:
	Mario Gonzalez
Project	:
	Ogilvy Holiday Card 2010
Abstract:
	Stores information about a connection to a client
Basic Usage:
	var aNewClient = new Client(this, connection, false);

	// Add to our list of connected users
	this.clients[clientID] = aNewClient;

	// broadcast message to all clients
	for( var clientID in this.clients ) {
		this.clients[clientID].sendMessage(encodedMessage);
	}

//*/
//define([ 'lib/jsclass-core', 'lib/bison', 'lib/SortedLookupTable' ], function( JS, BISON, SortedLookupTable ) {
//	return new JS.Class(
//	{
//		initialize: function( aServer, aConnection, config )
//		{
//			this.conn = aConnection;
//			this.nickname = '';
//			this.isPlaying = false; // Before the match, or if only observing this is false
//
//			this.netChannel = aServer;
//
//			this.commandTypes = config.CMDS;
//
//			this.updaterate = config.CLIENT_SETTING.updaterate; 	// Send user info this ofte
//			this.cmdrate =  config.CLIENT_SETTING.cmdrate;			// Receive user info this often
//			this.rate =  config.CLIENT_SETTING.rate;				// Cap bandwidth/sec
//
//			// 	Array of the last 31 messages sent/received
//			// This is used in the messageBuffer bitmask - It's the sequence number - store
//			this.MESSAGE_BUFFER_MASK = 31;
//
//			// outgoing sent
//			this.outgoingMessageBuffer = [];
//			this.outgoingSequenceNumber = 0;
//			// incoming received
//			this.incommingMessageBuffer = [];
//			this.incomingSequenceNumber = 0;
//
//			// Every tick store the queued commands here, every CLIENT_CONFIG.updateRate, send the queue
//			this.cmdBuffer = [];
//			this.stagnentEntities = new SortedLookupTable(); // things that are active but haven't changed since before
//
//			// This is used to see if we should send a client a new world state, or should accept a msg from the client (prevent flooding)
//			// Note both are set to -updaterate so next tick garantees a msg send
//			this.lastSentMessageTime = -this.updaterate;
//			this.lastReceivedMessageTime = -this.updaterate;
//		},
//
//		onMessage: function( aDecodedMessage )
//		{
//			var messageIndex = this.incomingSequenceNumber & this.MESSAGE_BUFFER_MASK;
//			this.incommingMessageBuffer[messageIndex] = aDecodedMessage;
//
//			this.incomingSequenceNumber++;
//		},
//
//		/**
//		 * Send an encoded (and delta compressed) message to the connection
//		 * @param anEncodedMessage Bison Encoded message
//		 * @param gameClock		   The current (zero-based) game clock
//		 */
//		sendMessage: function( anEncodedMessage, gameClock )
//		{
//			this.lastSentMessageTime = gameClock;
//
//			// Store inside our outgoingMessageBuffer - which holds 'MESSAGE_BUFFER_MASK' lerped number of messages
//			var messageIndex = this.outgoingSequenceNumber & this.MESSAGE_BUFFER_MASK;
//			this.outgoingMessageBuffer[messageIndex] = anEncodedMessage;
//
//			// Send and increment our message count
//			this.conn.send( anEncodedMessage );
//			this.outgoingSequenceNumber++;
//
//			// Incriment bytes sent by the NetChannel
//			this.netChannel.bytes.sent += anEncodedMessage.length;
//		},
//
//
//		/**
//		 * Sends the current cmdBuffer
//		 */
//		sendQueuedCommands: function( gameClock )
//		{
//			var messageContent = {gameClock: gameClock, id:1, seq: this.outgoingSequenceNumber, cmds:{cmd:this.commandTypes.FULL_UPDATE}, data:this.cmdBuffer};
//			var encodedMessage = BISON.encode(messageContent);
//
//			this.sendMessage(encodedMessage, gameClock);
//
//			this.cmdBuffer = [];
//		},
//
//		/**
//		 * Compares the worldDescription to the last one we sent - removes unchanged values
//		 * @param worldDescription A description of all the entities currently in the world
//		 * @param gameClock		   The current (zero-based) game clock
//		 */
//		compressDeltaAndQueueMessage: function( worldDescription, gameClock )
//		{
//			var allEntities = worldDescription.entities,
//				len = allEntities.length;
//
//			var resultDescStr = '';
//			while(len--)
//			{
//				var anEntityDescStr = allEntities[len],
//					anEntityDesc = anEntityDescStr.split(','),
//					objectID = +anEntityDesc[0],
//					clientID = +anEntityDesc[1];
//
//				// Server owned
//				var hasNewData = true;
//				if(clientID == 0)
//				{
//				   var previouslySentEntityDescription = this.stagnentEntities.objectForKey(objectID);
//				   if(previouslySentEntityDescription) {
////					   hasNewData = false;
//				   }
//				}
//
//				// Store for next time
//				this.stagnentEntities.setObjectForKey(anEntityDesc, objectID);
//
//				// Only send if it has new data
//				if(hasNewData) {
//					resultDescStr += "|" + anEntityDescStr;
//				}
//			}
//			var entityDescriptionObject = {};
//			entityDescriptionObject.entities = resultDescStr;
//			entityDescriptionObject.gameClock = worldDescription.gameClock;
//			entityDescriptionObject.gameTick = worldDescription.gameTick;
//
//			this.cmdBuffer.push( entityDescriptionObject );
//			return worldDescription;
//		},
//
//		/**
//		 * Returns true if its ok to send this client a new message
//		 * @param gameClock
//		 */
//		canSendMessage: function( gameClock ) {
//			return (gameClock - this.lastSentMessageTime) > this.updaterate;
//		}
//
//	}); // close extend
//});