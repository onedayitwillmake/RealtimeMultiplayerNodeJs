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
		onCollisionManagerCollision: function(ci, cj, v )
		{
			if(ci.delegate.entityType == BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY) {
//				console.log("PLAYA-A");
			} else if(cj.delegate.entityType == BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY) {
				var newRadius = 10.0 + Math.random() * 10;
				cj.setRadius( newRadius );
				cj.delegate.radius = newRadius;
			}
//			console.log("THINGS ARE HAPPENING:",ci.delegate.radius);
//			this.collisionCallback = {'block': block, 'scope': scope};
		},

		/**
		 * Randomly places some CircleEntities into game
		 */
		setupRandomField: function() {
			//RealtimeMultiplayerGame.model.noise(10, 10, i/total)
			var total = BubbleDots.Constants.MAX_CIRCLES;
			for(var i = 0; i < total; i++) {
				var radius = BubbleDots.Constants.ENTITY_DEFAULT_RADIUS + Math.random() * 5;
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
			var circleEntity = new BubbleDots.CandyEntity( anEntityid, aClientid );
			circleEntity.radius = aRadius;
			circleEntity.position.set( Math.random() * BubbleDots.Constants.GAME_WIDTH, Math.random() * BubbleDots.Constants.GAME_HEIGHT);
			circleEntity.setCollisionCircle( collisionCircle );

			// Place the circle and collision circle into corresponding containers
			this.collisionManager.addCircle( circleEntity.getCollisionCircle() );
			this.fieldController.addEntity( circleEntity );

			return circleEntity;
		},

		createPlayerEntity: function( anEntityid, aClientid) {
			// Create the GameEntity
			var playerEntity = new BubbleDots.PlayerEntity( anEntityid, aClientid );
				playerEntity.position.set( Math.random() * BubbleDots.Constants.GAME_WIDTH, Math.random() * BubbleDots.Constants.GAME_HEIGHT);

			var collisionCircle = new RealtimeMultiplayerGame.modules.circlecollision.PackedCircle();
				collisionCircle.setRadius( playerEntity.radius );

			playerEntity.setInput( new RealtimeMultiplayerGame.Input.Keyboard() );
			playerEntity.setCollisionCircle( collisionCircle );

			// place player on field
			this.collisionManager.addCircle( playerEntity.getCollisionCircle() );
			this.fieldController.addPlayer( playerEntity );

			return playerEntity;
		},

		/**
		 * Updates the game
		 * Creates a WorldEntityDescription which it sends to NetChannel
		 */
		tick: function() {
			this.collisionManager.handleBoundaryForAllCircles();
			this.collisionManager.handleCollisions();

//			if( this.fieldController.players.objectForKey(1) )
//				console.log( this.fieldController.players.objectForKey(1).entityType === BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY)
			// Note we call superclass's implementation after we're done
			BubbleDots.DemoServerGame.superclass.tick.call(this);
		},

		shouldAddPlayer: function( aClientid, data ) {
			this.createPlayerEntity( this.getNextEntityID(), aClientid);
		},

		shouldUpdatePlayer: function( aClientid, data ) {
			var entity = this.fieldController.getEntityWithid( data.payload.entityid );
			entity.input.deconstructInputBitmask( data.payload.input );
		},

		shouldRemovePlayer: function( aClientid ) {
			BubbleDots.DemoServerGame.superclass.shouldRemovePlayer.call( this, aClientid );
			console.log("DEMO::REMOVEPLAYER");
		}
	};

	// extend RealtimeMultiplayerGame.AbstractServerGame
	RealtimeMultiplayerGame.extend(BubbleDots.DemoServerGame, RealtimeMultiplayerGame.AbstractServerGame, null);
})()