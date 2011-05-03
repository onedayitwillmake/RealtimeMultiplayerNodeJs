/**
File:
	DemoServerGame
Created By:
	Mario Gonzalez
Project:
	DemoApp
Abstract:
	This is a concrete server instance of our game
Basic Usage:
 	DemoServerGame = new DemoApp.DemoServerGame();
 	DemoServerGame.start();
 	DemoServerGame.explodeEveryone();
Version:
	1.0
*/
(function(){
	require("../model/ImprovedNoise.js");

	DemoApp.DemoServerGame = function() {
		DemoApp.DemoServerGame.superclass.constructor.call(this);
		this.setGameDuration( DemoApp.Constants.GAME_DURATION );
		this.setupRandomField();
		return this;
	};

	DemoApp.DemoServerGame.prototype = {

		/**
		 * Map RealtimeMultiplayerGame.Constants.CMDS to functions
		 * If ServerNetChannel does not contain a function, it will check to see if it is a special function which the delegate wants to catch
		 * If it is set, it will call that CMD on its delegate
		 */
		setupCmdMap: function() {
			DemoApp.DemoServerGame.superclass.setupCmdMap.call(this);
			this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE] = this.shouldUpdatePlayer;
		},

		/**
		 * Randomly places some CircleEntities into game
		 */
		setupRandomField: function() {
			//RealtimeMultiplayerGame.model.noise(10, 10, i/total)
			var total = DemoApp.Constants.MAX_CIRCLES;
			for(var i = 0; i < total; i++) {
				var radius = DemoApp.Constants.ENTITY_DEFAULT_RADIUS + Math.random() * 5;
				this.createCircleEntity( radius, this.getNextEntityID(), RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID );
			}
		},

		/**
		 * Helper method to create a single CircleEntity
		 * @param {Number} aRadius
		 * @param {Number} anEntityid
		 * @param {Number} aClientid
		 */
		createCircleEntity: function( aRadius, anEntityid, aClientid ) {

			// Create the GameEntity
			var circleEntity = new DemoApp.CircleEntity( anEntityid, aClientid );
			circleEntity.entityType = DemoApp.Constants.ENTITY_TYPES.GENERIC_CIRCLE;
			circleEntity.radius = aRadius;
			circleEntity.position.set( Math.random() * DemoApp.Constants.GAME_WIDTH, Math.random() * DemoApp.Constants.GAME_HEIGHT);

			// Place the circle and collision circle into corresponding containers
			this.fieldController.addEntity( circleEntity );
			return circleEntity;
		},

		/**
		 * Updates the game
		 * Creates a WorldEntityDescription which it sends to NetChannel
		 */
		tick: function() {
			// Do some fancy stuff for our own game

			// Loop through each entity and move it to the left
			this.fieldController.getEntities().forEach( function(key, entity) {
				entity.position.x -= 1;
				if(entity.position.x < 0) {
					entity.position.x = DemoApp.Constants.GAME_WIDTH;
				}
			}, this );

			// Note we call superclass's implementation after we're done
			DemoApp.DemoServerGame.superclass.tick.call(this);
		},

		/**
		 * @inheritDoc
		 */
		shouldAddPlayer: function( aClientid, data ) {
			// A player has joined the game - do something fancy
			this.createCircleEntity(50, this.getNextEntityID(), aClientid);
		},

		/**
		 * @inheritDoc
		 */
		shouldUpdatePlayer: function( aClientid, data ) {
			var entity = this.fieldController.getEntityWithid( data.payload.entityid );
			entity.input.deconstructInputBitmask( data.payload.input );
		},

		/**
		 * @inheritDoc
		 */
		shouldRemovePlayer: function( aClientid ) {
			DemoApp.DemoServerGame.superclass.shouldRemovePlayer.call( this, aClientid );
			console.log("DEMO::REMOVEPLAYER");
		},

		/**
		 * @inheritDoc
		 */
		dealloc: function() {
			DemoApp.DemoServerGame.superclass.dealloc.call(this);
		}
	};

	// extend RealtimeMultiplayerGame.AbstractServerGame
	RealtimeMultiplayerGame.extend(DemoApp.DemoServerGame, RealtimeMultiplayerGame.AbstractServerGame, null);
})()