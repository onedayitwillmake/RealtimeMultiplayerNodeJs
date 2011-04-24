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
	require("./ImprovedNoise.js");

	DemoApp.DemoServerGame = function() {
		DemoApp.DemoServerGame.superclass.constructor.call(this);
		this.setupCollisionManager();
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
			this.collisionManager.setBounds(0, 0, 700, 600);
			this.collisionManager.setNumberOfCollisionPasses(1);
			this.collisionManager.setNumberOfTargetingPasses(0);

			// Create a bunch of circles!
			var total = 25;

//			// temp place groups into array to pull from randomly
//			for(var i = 0; i < total; i++)
//			{
//				// Size
//				var aRadius = 18;
//
//				// Create the circle, that holds our 'CAAT' actor, and 'PackedCircle'
//				var circle = this.circlePool.getObject()
//					.setRadius(aRadius)
//					.setColor( GRAVEDANGER.UTILS.randomFromArray( allColors ) )
//					.create()
//					.setLocation(this.director.width*0.5, -100)
//					.setDefaultScale(GRAVEDANGER.Config.DEFAULT_SCALE + GRAVEDANGER.UTILS.randomFloat(-0.1, 0.1) );
////					.setVisible(false)
//
//				// Add to the collision simulation
//				this.packedCircleManager.addCircle( circle.getPackedCircle() );
//
//				// Add actor to the scene
//				GRAVEDANGER.CAATHelper.currentSceneLayers[1].addChild( circle.getCAATActor() );
//				tempArray.push(circle);
//			}

			// Listen for circle complete -
			//GRAVEDANGER.SimpleDispatcher.addListener(GRAVEDANGER.Circle.prototype.EVENTS.ON_CIRCLE_COMPLETE, this.onCircleComplete, this)
			// Listen for circle complete -
			//GRAVEDANGER.SimpleDispatcher.addListener(GRAVEDANGER.Circle.prototype.EVENTS.ON_CIRCLE_INTOABYSS, this.onCircleIntoAbyss, this);
		},

		/**
		 * Updates the gameworld
		 * Creates a WorldEntityDescription which it sends to NetChannel
		 */
		tick: function()
		{
			RealtimeMultiplayerGame.AbstractServerGame.superclass.tick.call(this);

			// Create a new world-entity-description,
			var worldEntityDescription = new WorldEntityDescription( this );

			this.netChannel.tick( this.gameClock, worldEntityDescription );


			if( this.gameClock > this.model.gameDuration) {
				this.shouldEndGame();
			}
		},

		onPlayerJoined: function( client, data )
		{
			console.log("(AbstractServerGame)::onPlayerJoined");
		},

		onPlayerUpdate: function( client, data )
		{
			console.log("(AbstractServerGame)::onPlayerUpdate");
		},

		onPlayerDisconnect: function( client, data )
		{
			console.log("(AbstractServerGame)::onPlayerDisconnect");
		}

	}

	// extend RealtimeMultiplayerGame.AbstractServerGame
	RealtimeMultiplayerGame.extend(DemoApp.DemoServerGame, RealtimeMultiplayerGame.AbstractServerGame, null);
})()