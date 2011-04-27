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
		this.setupCollisionManager();
		this.setupRandomField();
		return this;
	};

	DemoApp.DemoServerGame.prototype = {
		 collisionManager			: null,

		/**
		 * Map RealtimeMultiplayerGame.Constants.CMDS to functions
		 * If ServerNetChannel does not contain a function, it will check to see if it is a special function which the delegate wants to catch
		 * If it is set, it will call that CMD on its delegate
		 */
		setupCmdMap: function() {
			DemoApp.DemoServerGame.superclass.setupCmdMap();
			console.log("SETTING COMMAND MAP");
			this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE] = this.shouldUpdatePlayer;
		},

		setupCollisionManager: function() {
			// Collision simulation
			this.collisionManager = new RealtimeMultiplayerGame.modules.circlecollision.CircleManager();
			this.collisionManager.setBounds(0, 0, DemoApp.Constants.GAME_WIDTH, DemoApp.Constants.GAME_HEIGHT);
			this.collisionManager.setNumberOfCollisionPasses(1);
			this.collisionManager.setNumberOfTargetingPasses(0);
		},

		/**
		 * Randomly places some CircleEntities into game
		 */
		setupRandomField: function() {
			//RealtimeMultiplayerGame.model.noise(10, 10, i/total)
			var total = 1;
			for(var i = 0; i < total; i++) {
				var radius = Math.floor( Math.random() * 10 + 5 );
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
			// Create a randomly sized circle, that will represent this entity in the collision manager
			var collisionCircle = new RealtimeMultiplayerGame.modules.circlecollision.PackedCircle();
				collisionCircle.setRadius( aRadius );

			// Create the GameEntity
			var circleEntity = new DemoApp.CircleEntity( anEntityid, aClientid );
			circleEntity.position.set( Math.random() * DemoApp.Constants.GAME_WIDTH, Math.random() * DemoApp.Constants.GAME_HEIGHT );
			circleEntity.setCollisionCircle( collisionCircle );

			// Place the circle and collision circle into corresponding containers
			this.collisionManager.addCircle( circleEntity.getCollisionCircle() );
			this.fieldController.addEntity( circleEntity );

			circleEntity.entityType = DemoApp.Constants.ENTITY_TYPES.GENERIC_CIRCLE;
			console.log( "creating circle entity:");
			console.log( circleEntity );
			return circleEntity;
		},

		createPlayerEntity: function( aRadius, anEntityid, aClientid) {
			var collisionCircle = new RealtimeMultiplayerGame.modules.circlecollision.PackedCircle();
				collisionCircle.setRadius( aRadius );

			// Create the GameEntity
			var playerEntity = new DemoApp.PlayerEntity( anEntityid, aClientid );
			playerEntity.position.set( Math.random() * DemoApp.Constants.GAME_WIDTH, Math.random() * DemoApp.Constants.GAME_HEIGHT );
			playerEntity.setCollisionCircle( collisionCircle );
			
			// place player on field
			this.collisionManager.addCircle( playerEntity.getCollisionCircle() );
			this.fieldController.addEntity( playerEntity );

			return playerEntity;
		},

		/**
		 * Updates the game
		 * Creates a WorldEntityDescription which it sends to NetChannel
		 */
		tick: function() {
		   	this.collisionManager.handleCollisions();

			var allCircles = this.collisionManager.getAllCircles();
			var len = allCircles.length;

			// push toward target position
			for(var n = 0; n < len; n++)
			{
				var aCircle = allCircles[n];
				// aCircle.position.x += 1.5 + (n/len);

				this.collisionManager.handleBoundaryForCircle( aCircle );
//				aCircle.position.y += Math.random() * 2 - 1;
				aCircle.delegate.position = aCircle.position.clone();
			}

			// Note we call superclass's implementation after we're done
			DemoApp.DemoServerGame.superclass.tick.call(this);
		},

		shouldAddPlayer: function( aClientid, data ) {
			this.createPlayerEntity( 100, this.getNextEntityID(), aClientid);
		},

		shouldUpdatePlayer: function( aClientid, data ) {
			console.log( data );
			console.log("DEMO::UPDATEPLAYER" + data);
		},

		shouldRemovePlayer: function( aClientid ) {
			console.log("DEMO::REMOVEPLAYER");
		}
	}

	// extend RealtimeMultiplayerGame.AbstractServerGame
	RealtimeMultiplayerGame.extend(DemoApp.DemoServerGame, RealtimeMultiplayerGame.AbstractServerGame, null);
})()