/**
 File:
 AbstractClientGame.js
 Created By:
 Mario Gonzalez
 Project:
 RealtimeMultiplayerNodeJS
 Abstract:
 This class is the client side base Game controller
 Basic Usage:
 [This class is not instantiated! - below is an example of using this class by extending it]

 (function(){
		MyGameClass = function() {
			return this;
 		}

		RealtimeMultiplayerGame.extend(MyGameClass, RealtimeMultiplayerGame.AbstractGame, null);
	};
 */
(function () {
    RealtimeMultiplayerGame.AbstractClientGame = function () {
        RealtimeMultiplayerGame.AbstractClientGame.superclass.constructor.call(this);
        this.setupView();
        return this;
    };

    RealtimeMultiplayerGame.AbstractClientGame.prototype = {
        view: null,							// View
        clientCharacter: null,							// Reference to this users character
        nickname: '',							// User 'nickname'
        locateUpdateFailedCount: 0,

        // Methods
        /**
         * Setup the view
         * RealtimeMultiplayerNodeJS is agnostic any rendering method
         */
        setupView: function () {
            if (this.view === null) {  // If this is called, then user has not overwritten this function
                throw new Error("RealtimeMultiplayerGame.AbstractClientGame.setupView - Override this method, then call MyClientGame.superclass.setupView()");
            }
            this.fieldController.setView(this.view);
        },

        /**
         * @inheritDoc
         */
        setupNetChannel: function () {
            console.log("RealtimeMultiplayerGame.AbstractClientGame.superclass", RealtimeMultiplayerGame.AbstractClientGame.superclass)
            RealtimeMultiplayerGame.AbstractClientGame.superclass.setupNetChannel.call(this);
            this.netChannel = new RealtimeMultiplayerGame.ClientNetChannel(this);
        },

        /**
         * @inheritDoc
         */
        setupCmdMap: function () {
            RealtimeMultiplayerGame.AbstractClientGame.superclass.setupCmdMap.call(this);
        },

        /**
         * @inheritDoc
         */
        tick: function () {
            RealtimeMultiplayerGame.AbstractClientGame.superclass.tick.call(this);

            // Allow all entities to update their position
            this.fieldController.getEntities().forEach(function (key, entity) {
                entity.updateView();
            }, this);

            // Continuously queue information about our input - which will be sent to the server by netchannel
            if (this.clientCharacter != null) {
                var input = this.clientCharacter.constructEntityDescription();
                this.netChannel.addMessageToQueue(false, RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE, input);
            }

            // Draw the gameworld
            this.renderAtTime(this.gameClock - RealtimeMultiplayerGame.Constants.CLIENT_SETTING.INTERP - RealtimeMultiplayerGame.Constants.CLIENT_SETTING.FAKE_LAG);
            this.netChannel.tick();
        },

        /**
         * Renders back in time between two previously received messages allowing for packet-loss, and a smooth simulation
         * @param renderTime
         */
        renderAtTime: function (renderTime) {
            var cmdBuffer = this.netChannel.getIncomingWorldUpdateBuffer(),
                len = cmdBuffer.length;

            // Need atleast 2 updates to render between
            if (len < 2) return;
            var newPosition = new RealtimeMultiplayerGame.model.Point(0, 0),
                newRotation = 0.0;

            // if the distance between prev and next is too great - don't interpolate
            var maxInterpolationDistance = 150,
                maxInterpSQ = maxInterpolationDistance * maxInterpolationDistance;

            // Store the next world-entity-description before and after the desired render time
            var nextWED = null,
                previousWED = null;

            // Loop through the points, until we find the first one that has a timeValue which is greater than our renderTime
            // Knowing that then we know that the combined with the one before it - that passed our just check - we know we want to render ourselves somehwere between these two points
            var i = 0;
            var forceUpdate = false;
            while (++i < len) {
                var currentWED = cmdBuffer[i];

                // We fall between this "currentWorldEntityDescription", and the last one we just checked
                if (currentWED.gameClock >= renderTime) {
                    previousWED = cmdBuffer[i - 1];
                    nextWED = currentWED;
                    this.locateUpdateFailedCount = 0;
                    break;
                }

                // Have no found a matching update for a while - the client is way behind the server, set our time to the time of the last udpate we received
//				if(i === len -1) {
//					if(++this.locateUpdateFailedCount === RealtimeMultiplayerGame.Constants.CLIENT_SETTING.MAX_UPDATE_FAILURE_COUNT) {
//						this.gameClock = currentWED.gameClock;
//						this.gameTick = currentWED.gameTick;
//						previousWED = cmdBuffer[i-1];
//						nextWED = currentWED;
//					}
//				}
            }

            // Could not find two points to render between
            if (nextWED == null || previousWED == null) {
                console.log("GIVE UP")
                return false;
            }

            /**
             * More info: http://www.learningiphone.com/2010/09/consicely-animate-an-object-along-a-path-sensitive-to-time/
             * Find T in the time value between the points:
             *
             * durationBetweenPoints: Amount of time between the timestamp in both points
             * offset: Figure out what our time would be if we pretended the previousBeforeTime.time was 0.00 by subtracting it from us
             * t: Now that we have a zero based offsetTime, and a maximum time that is also zero based (durationBetweenPoints)
             * we can easily figure out what offsetTime / duration.
             *
             * Example values: timeValue = 5.0f, nextPointTime = 10.0f, lastPointTime = 4.0f
             * result:
             * duration = 6.0f
             * offsetTime = 1.0f
             * t = 0.16
             */
            var durationBetweenPoints = (nextWED.gameClock - previousWED.gameClock);
            var offsetTime = renderTime - previousWED.gameClock;
            var activeEntities = {};

            // T is where we fall between, as a function of these two points
            var t = offsetTime / (nextWED.gameClock - previousWED.gameClock);
            if (t > 1.0)  t = 1.0;
            else if (t < 0) t = 0.0;

            // Note: We want to render at time "B", so grab the position at time "A" (previous), and time "C"(next)
            var entityPositionPast = new RealtimeMultiplayerGame.model.Point(0, 0),
                entityRotationPast = 0;

            var entityPositionFuture = new RealtimeMultiplayerGame.model.Point(0, 0),
                entityRotationFuture = 0;

            // Update players
            nextWED.forEach(function (key, entityDesc) {
                // Catch garbage values
                var entityid = entityDesc.entityid;
                var entity = this.fieldController.getEntityWithid(entityid);

                // We don't have this entity - create it!
                if (!entity) {
                    this.createEntityFromDesc(entityDesc);
                }
                else {
                    // We already have this entity - update it
                    var previousEntityDescription = previousWED.objectForKey(entityid);

                    // Could not find info for this entity in previous description
                    // This can happen if this is this entities first frame in the game
                    if (!previousEntityDescription) return;

                    // Store past and future positions to compare
                    entityPositionPast.set(previousEntityDescription.x, previousEntityDescription.y);
                    entityRotationPast = previousEntityDescription.rotation;

                    entityPositionFuture.set(entityDesc.x, entityDesc.y);
                    entityRotationFuture = entityDesc.rotation;

                    // if the distance between prev and next is too great - don't interpolate
                    if (entityPositionPast.getDistanceSquared(entityPositionFuture) > maxInterpSQ) {
                        t = 1;
                    }

                    // Interpolate the objects position by multiplying the Delta times T, and adding the previous position
                    newPosition.x = ( (entityPositionFuture.x - entityPositionPast.x) * t ) + entityPositionPast.x;
                    newPosition.y = ( (entityPositionFuture.y - entityPositionPast.y) * t ) + entityPositionPast.y;
                    newRotation = ( (entityRotationFuture - entityRotationPast) * t ) + entityRotationPast;
                }

                // Update the entity with the new information, and insert it into the activeEntities array
                this.fieldController.updateEntity(entityid, newPosition, newRotation, entityDesc);
                activeEntities[entityid] = true;

            }, this);


            // Destroy removed entities, every N frames
            if (this.gameTick % RealtimeMultiplayerGame.Constants.CLIENT_SETTING.EXPIRED_ENTITY_CHECK_RATE === 0)
                this.fieldController.removeExpiredEntities(activeEntities);
        },


        /**
         * Create an enitity using the information provided
         * @param {Object} entityDesc An object containing information such as 'entityid', 'clientid' and usually position information atleast
         */
        createEntityFromDesc: function (entityDesc) {
            // OVERRIDE
        },

        /**
         * Called by the ClientNetChannel, it sends us an array containing tightly packed values and expects us to return a meaningful object
         * It is left up to each game to implement this function because only the game knows what it needs to send.
         * However the 4 example projects in RealtimeMultiplayerNodeJS offer should be used ans examples
         *
         * @param {Array} entityDescAsArray An array of tightly packed values
         * @return {Object} An object which will be returned to you later on tied to a specific entity
         */
//		parseEntityDescriptionArray: function(entityDescAsArray)
//		{
//			// This is left in as an example, copy paste this into your AbstractClientGame subclass and modify from there
//			var entityDescription = {};
//
//			// It is left upto each game to implement this function because only the game knows what it needs to send.
//			// However the 4 example projects in RealtimeMultiplayerNodeJS offer this an example
////			entityDescription.entityid = +entityDescAsArray[0];
////			entityDescription.clientid = +entityDescAsArray[1];
////			entityDescription.entityType = +entityDescAsArray[2];
////			entityDescription.x = +entityDescAsArray[3];
////			entityDescription.y = +entityDescAsArray[4];
////			entityDescription.radius = +entityDescAsArray[5];
////			entityDescription.rotation = +entityDescAsArray[6];
//
//			return entityDescription;
//		},

//////	ClientNetChannelDelegate
        /**
         * ClientNetChannel has connected via socket.io to server for first time
         * Join the game
         * @param messageData
         */
        netChannelDidConnect: function (messageData) {
            // Sync time with server
            this.gameClock = messageData.payload.gameClock;
        },


        /**
         * Called when the user has entered a name, and wants to join the match
         * @param aNickname
         */
        joinGame: function (aNickname) {
            this.nickname = aNickname;
            // Create a 'join' message and queue it in ClientNetChannel
            this.netChannel.addMessageToQueue(true, RealtimeMultiplayerGame.Constants.CMDS.PLAYER_JOINED, { nickname: this.nickname });
        },


        /**
         * Start/Restart the game tick
         */
        startGameClock: function () {
            var that = this;
            (function animationLoop() {
                that.tick();

                if (that.isRunning)
                    requestAnimationFrame(animationLoop);
            })()
        },

        /**
         * Called by NetChannel when it receives a command if it decides not to intercept it.
         * (For example CMDS.FULL_UPDATE is always intercepted, so it never calls this function, but CMDS.SERVER_MATCH_START is not intercepted so this function triggered)
         * @param messageData
         */
        netChannelDidReceiveMessage: function (messageData) {
            // OVERRIDE
        },

        netChannelDidDisconnect: function () {
            this.isRunning = false;
            this.stopGameClock();
        },


        ///// Memory
        dealloc: function () {
            if (this.view) this.view.dealloc();
            this.view = null;

            RealtimeMultiplayerGame.AbstractClientGame.superclass.dealloc.call(this);
        }

        ///// Accessors
    };


    // Extend RealtimeMultiplayerGame.AbstractGame
    RealtimeMultiplayerGame.extend(RealtimeMultiplayerGame.AbstractClientGame, RealtimeMultiplayerGame.AbstractGame, null);
})()