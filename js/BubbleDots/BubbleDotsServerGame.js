/**
File:
	DemoServerGame
Created By:
	Mario Gonzalez
Project:
	BubbleDots
Abstract:
	This is a concrete server instance of our game
Basic Usage:
 	DemoServerGame = new BubbleDots.DemoServerGame();
 	DemoServerGame.start();
 	DemoServerGame.explodeEveryone();
Version:
	1.0
*/
(function(){
	require("../model/ImprovedNoise.js");
	require("./lib/color.js");

	BubbleDots.DemoServerGame = function() {
		BubbleDots.DemoServerGame.superclass.constructor.call(this);

		this.setGameDuration( BubbleDots.Constants.GAME_DURATION );
		this.setupCollisionManager();
		this.setupRandomField();

		return this;
	};

	BubbleDots.DemoServerGame.prototype = {
		 collisionManager			: null,

		/**
		 * Map RealtimeMultiplayerGame.Constants.CMDS to functions
		 * If ServerNetChannel does not contain a function, it will check to see if it is a special function which the delegate wants to catch
		 * If it is set, it will call that CMD on its delegate
		 */
		setupCmdMap: function() {
			BubbleDots.DemoServerGame.superclass.setupCmdMap.call(this);
			this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE] = this.shouldUpdatePlayer;
		},

		setupCollisionManager: function() {
			// Collision simulation
			this.collisionManager = new RealtimeMultiplayerGame.modules.circlecollision.CircleManager();
			this.collisionManager.setBounds(0, 0, BubbleDots.Constants.GAME_WIDTH, BubbleDots.Constants.GAME_HEIGHT);
			this.collisionManager.setNumberOfCollisionPasses(2);
			this.collisionManager.setNumberOfTargetingPasses(0);
			this.collisionManager.setCallback(this.onCollisionManagerCollision, this);
		},

		/**
		 * Called when the collision manager detects a collision
		 */
		onCollisionManagerCollision: function(ci, cj, v ) {
			ci.delegate.tempColor();
			cj.delegate.tempColor();

//			console.log(cj.acceleration);
			ci.delegate.acceleration.translatePoint( v.multiply(-10) );
		},

		/**
		 * Randomly places some CircleEntities into game
		 */
		setupRandomField: function() {
			//RealtimeMultiplayerGame.model.noise(10, 10, i/total)
			var total = BubbleDots.Constants.MAX_CIRCLES;
			for(var i = 0; i < total; i++) {
				var radius = BubbleDots.Constants.ENTITY_DEFAULT_RADIUS;
				this.createEntity( BubbleDots.CircleEntity, radius, this.getNextEntityID(), RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID );
			}
		},

		/**
		 * Helper method to create a single CircleEntity
		 * @param {Number} aRadius
		 * @param {Number} anEntityid
		 * @param {Number} aClientid
		 */
		createEntity: function( aBubbleDotEntityConstructor, aRadius, anEntityid, aClientid ) {
			// Create the GameEntity
			var circleEntity = new aBubbleDotEntityConstructor( anEntityid, aClientid );
			circleEntity.radius = aRadius;
			circleEntity.position.set( Math.random() * BubbleDots.Constants.GAME_WIDTH, BubbleDots.Constants.GAME_HEIGHT / 2 + Math.random() );
			circleEntity.setColor( CAAT.Color.prototype.hsvToRgb( (anEntityid * 15) % 360, 80, 99).toHex() );

			// Create a randomly sized circle, that will represent this entity in the collision manager
			var collisionCircle = new RealtimeMultiplayerGame.modules.circlecollision.PackedCircle();
			circleEntity.setCollisionCircle( collisionCircle );


			// Place the circle and collision circle into corresponding containers
			this.collisionManager.addCircle( circleEntity.getCollisionCircle() );
			this.fieldController.addEntity( circleEntity );

			return circleEntity;
		},

		/**
		 * Updates the game
		 * Creates a WorldEntityDescription which it sends to NetChannel
		 */
		tick: function() {
			this.collisionManager.handleCollisions();
			this.collisionManager.handleBoundaryForAllCircles();

			// Note we call superclass's implementation after we're done
			BubbleDots.DemoServerGame.superclass.tick.call(this);
		},

		/**
		 * @inheritDoc
		 */
		shouldAddPlayer: function( aClientid, data ) {

			var center = new RealtimeMultiplayerGame.model.Point( BubbleDots.Constants.GAME_WIDTH / 2,BubbleDots.Constants.GAME_HEIGHT / 2 );
			var playerEntity = this.createEntity( BubbleDots.PlayerEntity, 50, this.getNextEntityID(), aClientid );
			playerEntity.position = center.clone();
			playerEntity.getCollisionCircle().setPosition( center.clone() );
			playerEntity.setInput( new RealtimeMultiplayerGame.Input.Keyboard() );

			this.fieldController.addPlayer( playerEntity );
		},

		shouldUpdatePlayer: function( aClientid, data ) {
			var entity = this.fieldController.getEntityWithid( data.payload.entityid );
			entity.input.deconstructInputBitmask( data.payload.input );
		},

		shouldRemovePlayer: function( aClientid ) {
			BubbleDots.DemoServerGame.superclass.shouldRemovePlayer.call( this, aClientid );
		}
	};

	// extend RealtimeMultiplayerGame.AbstractServerGame
	RealtimeMultiplayerGame.extend(BubbleDots.DemoServerGame, RealtimeMultiplayerGame.AbstractServerGame, null);
})()