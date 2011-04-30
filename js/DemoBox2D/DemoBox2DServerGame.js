/**
File:
	DemoServerGame
Created By:
	Mario Gonzalez
Project:
	DemoBox2D
Abstract:
	This is a demo of using Box2d.js with RealTimeMultiplayerNode.js
 	The box2d.js world creation and other things in this demo, are shamelessly lifted from the https://github.com/HBehrens/box2d.js examples
Basic Usage:
 	DemoServerGame = new DemoBox2D.DemoServerGame();
 	DemoServerGame.start();
 	DemoServerGame.explodeEveryone();
Version:
	1.0
*/
(function(){
	var BOX2D = require("./lib/box2d.js");
	var ps = DemoBox2D.Constants.PHYSICS_SCALE;
	DemoBox2D.DemoServerGame = function() {
		DemoBox2D.DemoServerGame.superclass.constructor.call(this);

		this.setGameDuration( DemoBox2D.Constants.GAME_DURATION );
		this.setupBox2d();
		return this;
	};

	DemoBox2D.DemoServerGame.prototype = {
		_world							: null,
		_velocityIterationsPerSecond    : 300,
		_positionIterationsPerSecond	: 200,

		/**
		 * Map RealtimeMultiplayerGame.Constants.CMDS to functions
		 * If ServerNetChannel does not contain a function, it will check to see if it is a special function which the delegate wants to catch
		 * If it is set, it will call that CMD on its delegate
		 */
		setupCmdMap: function() {
			DemoBox2D.DemoServerGame.superclass.setupCmdMap.call(this);
			this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE] = this.shouldUpdatePlayer;
		},

		setupBox2d: function() {
			this.createBox2dWorld();
			this._world.DestroyBody(this._wallBottom);

			for(var i = 0; i < DemoBox2D.Constants.MAX_CIRCLES; i ++) {
				var x = (DemoBox2D.Constants.GAME_WIDTH/2) + Math.sin(i/5) * 100;
				var y = DemoBox2D.Constants.ENTITY_BOX_SIZE - (i * DemoBox2D.Constants.ENTITY_BOX_SIZE)
				this.spawn(x, y, 0);
			}
		},

		createBox2dWorld: function() {
			var m_world = new BOX2D.b2World(new BOX2D.b2Vec2(0, 10), true);
			var m_physScale = 1;
			m_world.SetWarmStarting(true);

			// Create border of boxes
			var wall = new BOX2D.b2PolygonShape();
			var wallBd = new BOX2D.b2BodyDef();

//			// Left
			wallBd.position.Set(0, DemoBox2D.Constants.GAME_HEIGHT/2);
			wall.SetAsBox(1, DemoBox2D.Constants.GAME_HEIGHT/2);
			this._wallLeft = m_world.CreateBody(wallBd);
			this._wallLeft.CreateFixture2(wall);
//			// Right
			wallBd.position.Set(DemoBox2D.Constants.GAME_WIDTH, DemoBox2D.Constants.GAME_HEIGHT/2);
			wall.SetAsBox(1, DemoBox2D.Constants.GAME_HEIGHT/2);
			this._wallRight = m_world.CreateBody(wallBd);
			this._wallRight.CreateFixture2(wall);
			// BOTTOM
			wallBd.position.Set(DemoBox2D.Constants.GAME_WIDTH/2 * DemoBox2D.Constants.PHYSICS_SCALE, DemoBox2D.Constants.GAME_HEIGHT);
			wall.SetAsBox(DemoBox2D.Constants.GAME_WIDTH/2, 1);
			this._wallTop = m_world.CreateBody(wallBd);
			this._wallTop.CreateFixture2(wall);
			// TOP
			wallBd.position.Set(DemoBox2D.Constants.GAME_WIDTH/2 * DemoBox2D.Constants.PHYSICS_SCALE, 0);
			wall.SetAsBox(DemoBox2D.Constants.GAME_WIDTH/2, 1);
			this._wallBottom = m_world.CreateBody(wallBd);
			this._wallBottom.CreateFixture2(wall);

			this._world = m_world;
		},

		createBall: function(world, x, y, radius) {
			radius = radius || 2;

			var fixtureDef = new BOX2D.b2FixtureDef();
			fixtureDef.shape = new BOX2D.b2CircleShape(radius);
			fixtureDef.friction = 0.4;
			fixtureDef.restitution = 0.6;
			fixtureDef.density = 1.0;

			var ballBd = new BOX2D.b2BodyDef();
			ballBd.type = b2Body.b2_dynamicBody;
			ballBd.position.Set(x,y);
			var body = world.CreateBody(ballBd);
			body.CreateFixture(fixtureDef);
			return body;
		},

		spawn: function(x, y, a) {
			var bodyDef = new BOX2D.b2BodyDef();
			bodyDef.type = BOX2D.b2Body.b2_dynamicBody;
			bodyDef.position.Set(x, y);
			bodyDef.angle = a;

			var body = this._world.CreateBody(bodyDef);
			body.w = DemoBox2D.Constants.ENTITY_BOX_SIZE;
			body.h = DemoBox2D.Constants.ENTITY_BOX_SIZE;
			var shape = new BOX2D.b2PolygonShape.AsBox(body.w, body.h);
			var fixtureDef = new BOX2D.b2FixtureDef();
			fixtureDef.restitution = 0.0;
			fixtureDef.density = 0.1;//10.0;
			fixtureDef.friction = 0.2;
			fixtureDef.shape = shape;
			body.CreateFixture(fixtureDef);

			// Create the entity for it in RealTimeMultiplayerNodeJS
			var circleEntity = new DemoBox2D.CircleEntity( this.getNextEntityID(), RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID );
			circleEntity.setBox2DBody( body );

			this.fieldController.addEntity( circleEntity );

			return body;
		},


		/**
		 * Updates the game
		 * Creates a WorldEntityDescription which it sends to NetChannel
		 */
		tick: function() {
			var delta = 16 / 1000;
			this.step( delta );

			if(Math.random() < 0.1) {
				this.resetRandomBody();
			}
			// Note we call superclass's implementation after we're done
			DemoBox2D.DemoServerGame.superclass.tick.call(this);
		},

		/**
		 * Resets an entity and drops it from the sky
		 */
		resetRandomBody: function() {

			// Retrieve a random key, and use it to retreive an entity
			var allEntities = this.fieldController.getEntities();
			var randomKeyIndex = Math.floor(Math.random() * allEntities._keys.length);
			var entity = allEntities.objectForKey( allEntities._keys[randomKeyIndex] );

			var x = (DemoBox2D.Constants.GAME_WIDTH/2) + Math.sin( Math.random() * Math.PI * 2) * 100;
			var y = Math.random() * -500;
			entity.getBox2DBody().SetPosition( new BOX2D.b2Vec2( x, y ) );
		},

		step: function( delta ) {
			this._world.ClearForces();
//			var delta = (typeof delta == "undefined") ? 1/this._fps : delta;
			this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
		},

		shouldAddPlayer: function( aClientid, data ) {
//			this.createPlayerEntity( this.getNextEntityID(), aClientid);
		},

		shouldUpdatePlayer: function( aClientid, data ) {
			var entity = this.fieldController.getEntityWithid( data.payload.entityid );
		},

		shouldRemovePlayer: function( aClientid ) {
//			DemoBox2D.DemoServerGame.superclass.shouldRemovePlayer.call( this, aClientid );
//			console.log("DEMO::REMOVEPLAYER");
		}
	};

	// extend RealtimeMultiplayerGame.AbstractServerGame
	RealtimeMultiplayerGame.extend(DemoBox2D.DemoServerGame, RealtimeMultiplayerGame.AbstractServerGame, null);
})()