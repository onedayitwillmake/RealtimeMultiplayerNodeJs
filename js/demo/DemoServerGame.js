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
			DemoApp.DemoServerGame.superclass.setupCommandMap();
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
			var total = 25;
			for(var i = 0; i < total; i++) {

				var radius = Math.floor( Math.random() * 10 + 5 );

				// Create a randomly sized circle, that will represent this entity in the collision manager
				var collisionCircle = new RealtimeMultiplayerGame.modules.circlecollision.PackedCircle();
					collisionCircle.setRadius( radius );


				// Create the GameEntity
				var circleEntity = new DemoApp.CircleEntity( this.getNextEntityID(), RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID );
				circleEntity.position.set( Math.random() * DemoApp.Constants.GAME_WIDTH, Math.random() * DemoApp.Constants.GAME_HEIGHT );
				circleEntity.setCollisionCircle( collisionCircle );

				// Place the circle and collision circle into corresponding containers
				this.collisionManager.addCircle( circleEntity.getCollisionCircle() );
				this.fieldController.addEntity( circleEntity );
			}
		},

//		createCircleEntity: function( aRadius, position ) {
//
//		},

		/**
		 * Updates the game
		 * Creates a WorldEntityDescription which it sends to NetChannel
		 */
		tick: function() {
		   	this.collisionManager.handleCollisions();

			// Note we call superclass's implementation after we're done
			DemoApp.DemoServerGame.superclass.tick.call(this);
		},

		shouldUpdatePlayer: function( clientid, data ) {
			console.log("DEMO::UPDATEPLAYER");
		},

		shouldAddPlayer: function( entityID, clientid, data ) {
			console.log("DEMO::ADDPLAYER");
		},

		shouldRemovePlayer: function( clientid ) {
			console.log("DEMO::REMOVEPLAYER");
		}
	}

	// extend RealtimeMultiplayerGame.AbstractServerGame
	RealtimeMultiplayerGame.extend(DemoApp.DemoServerGame, RealtimeMultiplayerGame.AbstractServerGame, null);
})()