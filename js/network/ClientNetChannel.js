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
 */
(function () {
    var BUFFER_MASK = RealtimeMultiplayerGame.Constants.CLIENT_SETTING.MAX_BUFFER;

    // Retrieve the namespace
    RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.network");

    RealtimeMultiplayerGame.ClientNetChannel = function (aDelegate) {
        this.setDelegate(aDelegate);
        this.setupSocketIO();
//		this.setupWSClient();
        this.setupCmdMap();
        return this;
    };

    RealtimeMultiplayerGame.ClientNetChannel.prototype = {
        delegate: null,				// Object informed when ClientNetChannel does interesting stuff
        socketio: null,				// Reference to singluar Socket.IO instance
        clientid: null,				// A client id is set by the server on first connect

        // Settings
        cl_updateRate: RealtimeMultiplayerGame.Constants.CLIENT_SETTING.CMD_RATE,		// How often we can receive messages per sec

        // connection info
        latency: 1000,				// Current latency time from server
        lastSentTime: -1,				// Time of last sent message
        lastRecievedTime: -1,				// Time of last recieved message

        // Data
        messageBuffer: [],				// Store last N messages to be sent
        outgoingSequenceNumber: 0,
        incomingWorldUpdateBuffer: [],				// Store last N received WorldDescriptions
        reliableBuffer: null,				// We sent a 'reliable' message and are waiting for acknowledgement that it was sent

        cmdMap: {},				// Map the CMD constants to functions


        setupSocketIO: function () {
            debugger;
            this.socketio = new io.connect(RealtimeMultiplayerGame.Constants.SERVER_SETTING.GET_URI(), {transports: ['websocket', 'xhr-polling', 'jsonp-polling'], reconnect: false, rememberTransport: false});

            var that = this;
            this.socketio.on('connect', function () {
                that.onSocketConnect()
            });
            this.socketio.on('message', function (obj) {
                that.onSocketDidAcceptConnection(obj)
            });
            this.socketio.on('disconnect', function () {
                that.onSocketDisconnect()
            });
        },

        setupWSClient: function () {
            var that = this;
            this.connection = new WebSocket("ws://localhost:" + RealtimeMultiplayerGame.Constants.SERVER_SETTING.SOCKET_PORT + "/");
            this.socketio = this.connection;
            this.connection.onopen = function () {
                DemoHelloWorld.DemoClientGame.prototype.log("Connection.onopen");
            };

            this.connection.onmessage = function (event) {
                //DemoHelloWorld.DemoClientGame.prototype.log("Connection.onmessage");
                var message = BISON.decode(event.data);
                that.onSocketDidAcceptConnection(message);
            };
            this.connection.onclose = function (event) {
                DemoHelloWorld.DemoClientGame.prototype.log("Connection.onclose");
                that.onSocketDisconnect();
            };
        },

        /**
         * Map RealtimeMultiplayerGame.Constants.CMDS to functions
         */
        setupCmdMap: function () {
            this.cmdMap = {};
            this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.SERVER_FULL_UPDATE] = this.onServerWorldUpdate;
        },

        ///// SocketIO Callbacks
        onSocketConnect: function () {
            console.log("(ClientNetChannel):onSocketConnect", arguments, this.socketio);
        },

        /**
         * Called when ServerNetChannel has accepted your connection and given you a client id
         * This is only called once, use the info to set some properties
         */
        onSocketDidAcceptConnection: function (aNetChannelMessage) {

            console.log("(ClientNetChannel)::onSocketDidAcceptConnection", aNetChannelMessage);

            // Should not have received this msg
            if (aNetChannelMessage.cmd != RealtimeMultiplayerGame.Constants.CMDS.SERVER_CONNECT) {
                throw "(ClientNetChannel):onSocketDidAcceptConnection recieved but cmd != SERVER_CONNECT ";
            }

            this.clientid = aNetChannelMessage.id;
            this.delegate.log("(ClientNetChannel)::ClientID - ")
            this.delegate.netChannelDidConnect(aNetChannelMessage);

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
        onSocketMessage: function (aNetChannelMessage) {
            this.lastReceivedTime = this.delegate.getGameClock();
            this.adjustRate(aNetChannelMessage);

            if (aNetChannelMessage.id == this.clientid) // We sent this, clear our reliable buffer que
            {
                if (aNetChannelMessage.cmd == RealtimeMultiplayerGame.Constants.CMDS.SERVER_FULL_UPDATE) {
//					debugger; //  IF CALLED THIS IS A BUG
                }

                var messageIndex = aNetChannelMessage.seq & BUFFER_MASK;
                var message = this.messageBuffer[messageIndex];

                // Free up reliable buffer to allow for new message to be sent
                if (this.reliableBuffer === message) {
                    this.reliableBuffer = null;
                }

                // Remove from memory
                this.messageBuffer[messageIndex] = null;
                delete message;

                return;
            }

            // Call the mapped function
            if (this.cmdMap[aNetChannelMessage.cmd])
                this.cmdMap[aNetChannelMessage.cmd].call(this, aNetChannelMessage);
            else
                console.log("(NetChannel)::onSocketMessage could not map '" + aNetChannelMessage.cmd + "' to function!");
        },

        onSocketDisconnect: function () {
            this.delegate.netChannelDidDisconnect();
            this.connection = null;
            this.socketio = null;
            console.log("(ClientNetChannel)::onSocketDisconnect", arguments);
        },


        /**
         * Send queued messages
         */
        tick: function () {
            // Can't send new message, still waiting for last imporant message to be returned
            if (this.reliableBuffer !== null) return;

            var hasReliableMessages = false;
            var firstUnreliableMessageFound = null;

            var len = this.messageBuffer.length;
            for (var i = 0; i < len; i++) {
                var message = this.messageBuffer[i];
                if (!message) continue;	// Slot is empty

                // We have more important things to tend to sir.
                if (message.isReliable) {
                    hasReliableMessages = true;
                    this.sendMessage(message);
                    return;
                }
            }

            // No reliable messages waiting, enough time has passed to send an update
            if (!hasReliableMessages && this.canSendMessage() && this.nextUnreliable != null) {
                this.sendMessage(this.nextUnreliable);
                this.nextUnreliable = null;
            }
        },

        /**
         *
         * @param aNetChannelMessage
         */
        onServerWorldUpdate: function (aNetChannelMessage) {
            var len = aNetChannelMessage.data.length;
            var i = -1;

            // Store all world updates contained in the message.
            while (++i < len) // Want to parse through them in correct order, so no fancy --len
            {
                var singleWorldUpdate = aNetChannelMessage.data[i];
                var worldEntityDescription = this.createWorldEntityDescriptionFromString(singleWorldUpdate);

                // Add it to the incommingCmdBuffer and drop oldest element
                this.incomingWorldUpdateBuffer.push(worldEntityDescription);
                if (this.incomingWorldUpdateBuffer.length > BUFFER_MASK)
                    this.incomingWorldUpdateBuffer.shift();
            }
        },

        /**
         * Takes a WorldUpdateMessage that contains the information about all the elements inside of a string
         * and creates SortedLookupTable out of it with the entityid's as the keys
         * @param {String} aWorldUpdateMessage
         */
        createWorldEntityDescriptionFromString: function (aWorldUpdateMessage) {
            // Create a new WorldEntityDescription and store the clock and gametick in it
            var worldDescription = new SortedLookupTable();
            worldDescription.gameTick = aWorldUpdateMessage.gameTick;
            worldDescription.gameClock = aWorldUpdateMessage.gameClock;


            var allEntities = aWorldUpdateMessage.entities.split('|'),
                allEntitiesLen = allEntities.length; //

            // Loop through each entity
            while (--allEntitiesLen)   // allEntities[0] is garbage, so by using prefix we avoid it
            {
                // Loop through the string representing the entities properties
                var entityDescAsArray = allEntities[allEntitiesLen].split(',');
                var entityDescription = this.delegate.parseEntityDescriptionArray(entityDescAsArray);

                // Store the final result using the entityid
                worldDescription.setObjectForKey(entityDescription, entityDescription.entityid);
            }


            return worldDescription;
        },

        /**
         * Sends a message via socket.io
         * @param aMessageInstance
         */
        sendMessage: function (aMessageInstance) {
            if (this.socketio == undefined) {
                console.log("(ClientNetChannel)::sendMessage - socketio is undefined!");
                return;
            }

            if (!this.socketio.socket.connected) { // Socket.IO is not connectd, probably not ready yet
                // console.log("(ClientNetChannel)::sendMessage - socketio is undefined!");
                return;      //some error here
            }

            aMessageInstance.messageTime = this.delegate.getGameClock(); // Store to determine latency

            this.lastSentTime = this.delegate.getGameClock();

            if (aMessageInstance.isReliable) {
                this.reliableBuffer = aMessageInstance; // Block new connections
            }

            this.socketio.json.send(aMessageInstance);

            if (RealtimeMultiplayerGame.Constants.CLIENT_NETCHANNEL_DEBUG) console.log('(NetChannel) Sending Message, isReliable', aMessageInstance.isReliable, aMessageInstance);
        },

        /**
         * Prepare a message for sending at next available time
         * @param isReliable
         * @param anUnencodedMessage
         */
        addMessageToQueue: function (isReliable, aCommandConstant, payload) {
            // Create a NetChannelMessage
            var message = new RealtimeMultiplayerGame.model.NetChannelMessage(this.outgoingSequenceNumber, this.clientid, isReliable, aCommandConstant, payload);

            // Add to array the queue using bitmask to wrap values
            this.messageBuffer[ this.outgoingSequenceNumber & BUFFER_MASK ] = message;

            if (!isReliable) {
                this.nextUnreliable = message;
            }

            ++this.outgoingSequenceNumber;
            if (RealtimeMultiplayerGame.Constants.DEBUG_SETTING.CLIENT_NETCHANNEL_DEBUG) console.log('(NetChannel) Adding Message to queue', this.messageBuffer[this.outgoingSequenceNumber & BUFFER_MASK], " ReliableBuffer currently contains: ", this.reliableBuffer);
        },

        /**
         * Adjust the message chokerate based on latency
         * @param serverMessage
         */
        adjustRate: function (serverMessage) {
            var deltaTime = serverMessage.gameClock - this.delegate.getGameClock();
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
        dealloc: function () {
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
        setDelegate: function (aDelegate) {
            var theInterface = RealtimeMultiplayerGame.ClientNetChannelDelegateProtocol;
            for (var member in theInterface) {
                if ((typeof aDelegate[member] != typeof theInterface[member])) {
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
            var isReady = (this.delegate.getGameClock() > this.lastSentTime + this.cl_updateRate);
            return isReady;
        },
        getClientid: function () {
            return this.clientid
        },
        getIncomingWorldUpdateBuffer: function () {
            return this.incomingWorldUpdateBuffer
        },
        getLatency: function () {
            return this.latency
        }
    };

    /**
     * Required methods for the ClientNetChannel delegate
     */
    RealtimeMultiplayerGame.ClientNetChannelDelegateProtocol = {
        netChannelDidConnect: function () {
        },
        netChannelDidReceiveMessage: function (aMessage) {
        },
        netChannelDidDisconnect: function () {
        },
        parseEntityDescriptionArray: function () {
        },
        log: function () {
        },
        getGameClock: function () {
        }
    }
})()
