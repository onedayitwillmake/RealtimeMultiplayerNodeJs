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
Version:
	1.0
*/
(function(){
	RealtimeMultiplayerGame.AbstractClientGame = function() {
		RealtimeMultiplayerGame.AbstractClientGame.superclass.constructor.call(this);
		this.setupView();
		return this;
	};

	RealtimeMultiplayerGame.AbstractClientGame.prototype = {
		view										: null,							// View
		nickname									: '',							// User 'nickname'
		clientCharacter								: null,							// Reference to this users character


		// Methods
		setupView: function() {
			if( this.view === null ) {
				throw new Error("RealtimeMultiplayerGame.AbstractClientGame.setupView - Override this method, then call MyClientGame.superclass.setupView()");
			}
			this.fieldController.setView( this.view );
		},

		setupNetChannel: function() {
			console.log("RealtimeMultiplayerGame.AbstractClientGame.superclass", RealtimeMultiplayerGame.AbstractClientGame.superclass)
			RealtimeMultiplayerGame.AbstractClientGame.superclass.setupNetChannel.call(this);
			this.netChannel = new RealtimeMultiplayerGame.ClientNetChannel( this );
		},

		setupCmdMap: function() {
			RealtimeMultiplayerGame.AbstractClientGame.superclass.setupCmdMap.call( this );
		},

		tick: function() {
			RealtimeMultiplayerGame.AbstractClientGame.superclass.tick.call(this);

			// Allow all entities to update their position
			this.fieldController.getEntities().forEach( function(key, entity){
				entity.updateView();
			}, this );

			// Continuously queue information about our input - which will be sent to the server by netchannel
			if( this.clientCharacter != null ) {
				var input = this.clientCharacter.constructEntityDescription();
				this.netChannel.addMessageToQueue( false, RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE, input );
			}

			// Draw the gameworld
			this.renderAtTime(this.gameClock - RealtimeMultiplayerGame.Constants.CLIENT_SETTING.INTERP - RealtimeMultiplayerGame.Constants.CLIENT_SETTING.FAKE_LAG );
			this.netChannel.tick();
		},

		/**
		 * Renders back in time between two previously received messages allowing for packet-loss, and a smooth simulation
		 * @param renderTime
		 */
		renderAtTime: function(renderTime)
		{
			var cmdBuffer = this.netChannel.getIncomingWorldUpdateBuffer(),
				len = cmdBuffer.length;

			// Need atleast 2 updates to render between
			if( len < 2 ) return;

			var newPosition = new RealtimeMultiplayerGame.model.Point(0,0),
				newRotation = 0.0;

			// if the distance between prev and next is too great - don't interpolate
			var maxInterpolationDistance = 150,
				maxInterpSQ = maxInterpolationDistance*maxInterpolationDistance;

			// Store the next world-entity-description before and after the desired render time
			var nextWED = null,
				previousWED = null;

			// Loop through the points, until we find the first one that has a timeValue which is greater than our renderTime
			// Knowing that then we know that the combined with the one before it - that passed our just check - we know we want to render ourselves somehwere between these two points
			var i = 0;
			while(++i < len)
			{
				var currentWED = cmdBuffer[i];
				// We fall between this "currentWorldEntityDescription", and the last one we just checked
				if(currentWED.gameClock >= renderTime || i === len -1) {
					previousWED = cmdBuffer[i-1];
					nextWED = currentWED;
					break;
				}
			}

			// Could not find two points to render between
			if(nextWED == null || previousWED == null) {
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
			var t = offsetTime / (nextWED.gameClock - previousWED.gameClock);;
			if(t > 1.0)  t = 1.0;
			else if(t < 0) t = 0.0;

			// Note: We want to render at time "B", so grab the position at time "A" (previous), and time "C"(next)
			var entityPositionPast = new RealtimeMultiplayerGame.model.Point(0,0),
				entityRotationPast = 0;

			var entityPositionFuture = new RealtimeMultiplayerGame.model.Point(0,0),
				entityRotationFuture = 0;

			// Update players
			nextWED.forEach(function(key, entityDesc)
			{
				// Catch garbage values
				var entityid = entityDesc.entityid;
				var entity = this.fieldController.getEntityWithid( entityid );

				// We don't have this entity - create it!
				if( !entity ) {
					this.createEntityFromDesc( entityDesc );
				}
				else
				{ // We already have this entity - update it
					var previousEntityDescription = previousWED.objectForKey(entityid);

					// Could not find info for this entity in previous description
					// This can happen if this is this entities first frame in the game
					if(!previousEntityDescription) return;

					// Store past and future positions to compare
					entityPositionPast.set(previousEntityDescription.x, previousEntityDescription.y);
					entityRotationPast = previousEntityDescription.rotation;

					entityPositionFuture.set(entityDesc.x, entityDesc.y);
					entityRotationFuture = entityDesc.rotation;

					// if the distance between prev and next is too great - don't interpolate
					if(entityPositionPast.getDistanceSquared(entityPositionFuture) > maxInterpSQ) { t = 1; }

					// Interpolate the objects position by multiplying the Delta times T, and adding the previous position
					newPosition.x = ( (entityPositionFuture.x - entityPositionPast.x) * t ) + entityPositionPast.x;
					newPosition.y = ( (entityPositionFuture.y - entityPositionPast.y) * t ) + entityPositionPast.y;
					newRotation =  ( (entityRotationFuture - entityRotationPast) * t ) + entityRotationPast;
				}

				// Update the entity with the new information, and insert it into the activeEntities array
				this.fieldController.updateEntity( entityid, newPosition, newRotation );
				activeEntities[entityid] = true;

			}, this);


			// Destroy removed entities
			if(this.gameTick % RealtimeMultiplayerGame.Constants.CLIENT_SETTING.EXPIRED_ENTITY_CHECK_RATE === 0)
				this.fieldController.removeExpiredEntities( activeEntities );
//
//			this.director.render( this.clockActualTime - this.director.timeline );
//			this.director.timeline = this.clockActualTime;
		},


		createEntityFromDesc: function( entityDesc ) {
			// OVERRIDE
		},

	//////	ClientNetChannelDelegate
		/**
		 * ClientNetChannel has connected via socket.io to server for first time
		 * Join the game
		 * @param messageData
		 */
		netChannelDidConnect: function (messageData)
		{
			// Sync time with server
			this.gameClock = messageData.payload.gameClock;
		},


		/**
		 * Called when the user has entered a name, and wants to join the match
		 * @param aNickname
		 */
		joinGame: function(aNickname)
		{
			this.nickname = aNickname;
			// Create a 'join' message and queue it in ClientNetChannel
			this.netChannel.addMessageToQueue( true, RealtimeMultiplayerGame.Constants.CMDS.PLAYER_JOINED, { nickname: this.nickname } );
		},


		/**
		 * Start/Restart the game tick
		 */
		startGameClock: function()
		{
			/**
			 * Provides requestAnimationFrame in a cross browser way.
			 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
			 */

			var that = this;
			this.intervalTargetDelta = Math.floor( 1000/this.intervalFramerate );
			if ( !window.requestAnimationFrame ) {
//				   debugger;
				window.requestAnimationFrame = ( function() {

					return window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

						window.setTimeout( callback, 1000 / 60 );

					};

				} )();

			}

			(function animloop(){
				that.tick();
//				window.setTimeout( animloop, 1000 / 20 );
			  requestAnimationFrame(animloop);
			})();

//			this.intervalGameTick = setInterval( function(){ that.tick() }, this.intervalTargetDelta);
		},

		/**
		 * Called by NetChannel when it receives a command if it decides not to intercept it.
		 * (for example CMDS.FULL_UPDATE is always intercepted, so it never calls this function, but CMDS.SERVER_MATCH_START is not intercepted so this function triggered)
		 * @param messageData
		 */
		netChannelDidReceiveMessage: function (messageData)
		{
			// OVERRIDE
		},

		netChannelDidDisconnect: function (messageData)
		{
			// OVERRIDE
		},


		///// Memory
		dealloc: function() {
			if(this.view) this.view.dealloc();
			this.view = null;

			RealtimeMultiplayerGame.AbstractClientGame.superclass.dealloc.call(this);
		}

		///// Accessors
	};


	// Extend RealtimeMultiplayerGame.AbstractGame
	RealtimeMultiplayerGame.extend(RealtimeMultiplayerGame.AbstractClientGame, RealtimeMultiplayerGame.AbstractGame, null);
})()