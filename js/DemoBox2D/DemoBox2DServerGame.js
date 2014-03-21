/**
 File:
 DemoBox2DServerGame.js
 Created By:
 Mario Gonzalez
 Project:
 DemoBox2D
 Abstract:
 This is a demo of using Box2d.js with RealTimeMultiplayerNode.js
 The box2d.js world creation and other things in this demo, are shamelessly lifted from the https://github.com/HBehrens/box2d.js examples
 Basic Usage:
 demoServerGame = new DemoBox2D.DemoServerGame();
 demoServerGame.startGameClock();
 Version:
 1.0
 */
(function () {
    var BOX2D = require("./lib/box2d.js");
    DemoBox2D.DemoServerGame = function () {
        DemoBox2D.DemoServerGame.superclass.constructor.call(this);

        this.setGameDuration(DemoBox2D.Constants.GAME_DURATION);
        this.setupBox2d();
        return this;
    };

    DemoBox2D.DemoServerGame.prototype = {
        _world: null,
        _velocityIterationsPerSecond: 100,
        _positionIterationsPerSecond: 300,

        /**
         * Map RealtimeMultiplayerGame.Constants.CMDS to functions
         * If ServerNetChannel does not contain a function, it will check to see if it is a special function which the delegate wants to catch
         * If it is set, it will call that CMD on its delegate
         */
        setupCmdMap: function () {
            DemoBox2D.DemoServerGame.superclass.setupCmdMap.call(this);
            this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE] = this.shouldUpdatePlayer;
        },

        /**
         * Sets up the Box2D world and creates a bunch of boxes from that fall from the sky
         */
        setupBox2d: function () {

            DemoBox2D.Constants.GAME_WIDTH /= DemoBox2D.Constants.PHYSICS_SCALE;
            DemoBox2D.Constants.GAME_HEIGHT /= DemoBox2D.Constants.PHYSICS_SCALE;
            DemoBox2D.Constants.ENTITY_BOX_SIZE /= DemoBox2D.Constants.PHYSICS_SCALE;


            this.createBox2dWorld();
            this._world.DestroyBody(this._wallBottom);

            for (var i = 0; i < DemoBox2D.Constants.MAX_OBJECTS; i++) {
                var x = (DemoBox2D.Constants.GAME_WIDTH / 2) + Math.sin(i / 5);
                var y = i * -DemoBox2D.Constants.ENTITY_BOX_SIZE * 3;

                // Make a square or a box
                if (Math.random() < 0.5) this.createBall(x, y, DemoBox2D.Constants.ENTITY_BOX_SIZE);
                else this.createBox(x, y, 0, DemoBox2D.Constants.ENTITY_BOX_SIZE);
            }
        },

        /**
         * Creates the Box2D world with 4 walls around the edges
         */
        createBox2dWorld: function () {
            var m_world = new BOX2D.b2World(new BOX2D.b2Vec2(0, 10), true);
            m_world.SetWarmStarting(true);

            // Create border of boxes
            var wall = new BOX2D.b2PolygonShape();
            var wallBd = new BOX2D.b2BodyDef();

            // Left
            wallBd.position.Set(-1.5, DemoBox2D.Constants.GAME_HEIGHT / 2);
            wall.SetAsBox(1, DemoBox2D.Constants.GAME_HEIGHT * 10);
            this._wallLeft = m_world.CreateBody(wallBd);
            this._wallLeft.CreateFixture2(wall);
            // Right
            wallBd.position.Set(DemoBox2D.Constants.GAME_WIDTH + 0.55, DemoBox2D.Constants.GAME_HEIGHT / 2);
            wall.SetAsBox(1, DemoBox2D.Constants.GAME_HEIGHT * 10);
            this._wallRight = m_world.CreateBody(wallBd);
            this._wallRight.CreateFixture2(wall);
            // BOTTOM
            wallBd.position.Set(DemoBox2D.Constants.GAME_WIDTH / 2, DemoBox2D.Constants.GAME_HEIGHT + 0.55);
            wall.SetAsBox(DemoBox2D.Constants.GAME_WIDTH / 2, 1);
            this._wallTop = m_world.CreateBody(wallBd);
            this._wallTop.CreateFixture2(wall);
            // TOP
            wallBd.position.Set(DemoBox2D.Constants.GAME_WIDTH / 2, 1);
            wall.SetAsBox(DemoBox2D.Constants.GAME_WIDTH / 2, 1);
            this._wallBottom = m_world.CreateBody(wallBd);
            this._wallBottom.CreateFixture2(wall);

            this._world = m_world;
        },

        /**
         * Creates a Box2D circular body
         * @param {Number} x    Body position on X axis
         * @param {Number} y    Body position on Y axis
         * @param {Number} radius Body radius
         * @return {b2Body}    A Box2D body
         */
        createBall: function (x, y, radius) {
            var fixtureDef = new BOX2D.b2FixtureDef();
            fixtureDef.shape = new BOX2D.b2CircleShape(radius);
            fixtureDef.friction = 0.4;
            fixtureDef.restitution = 0.6;
            fixtureDef.density = 1.0;

            var ballBd = new BOX2D.b2BodyDef();
            ballBd.type = BOX2D.b2Body.b2_dynamicBody;
            ballBd.position.Set(x, y);
            var body = this._world.CreateBody(ballBd);
            body.CreateFixture(fixtureDef);

            // Create the entity for it in RealTimeMultiplayerNodeJS
            var aBox2DEntity = new DemoBox2D.Box2DEntity(this.getNextEntityID(), RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID);
            aBox2DEntity.setBox2DBody(body);
            aBox2DEntity.entityType = DemoBox2D.Constants.ENTITY_TYPES.CIRCLE;

            this.fieldController.addEntity(aBox2DEntity);

            return body;
        },

        /**
         * Creates a Box2D square body
         * @param {Number} x    Body position on X axis
         * @param {Number} y    Body position on Y axis
         * @param {Number} rotation    Body rotation
         * @param {Number} size Body size
         * @return {b2Body}    A Box2D body
         */
        createBox: function (x, y, rotation, size) {
            var bodyDef = new BOX2D.b2BodyDef();
            bodyDef.type = BOX2D.b2Body.b2_dynamicBody;
            bodyDef.position.Set(x, y);
            bodyDef.angle = rotation;

            var body = this._world.CreateBody(bodyDef);
            var shape = new BOX2D.b2PolygonShape.AsBox(size, size);
            var fixtureDef = new BOX2D.b2FixtureDef();
            fixtureDef.restitution = 0.1;
            fixtureDef.density = 1.0;
            fixtureDef.friction = 1.0;
            fixtureDef.shape = shape;
            body.CreateFixture(fixtureDef);

            // Create the entity for it in RealTimeMultiplayerNodeJS
            var aBox2DEntity = new DemoBox2D.Box2DEntity(this.getNextEntityID(), RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID);
            aBox2DEntity.setBox2DBody(body);
            aBox2DEntity.entityType = DemoBox2D.Constants.ENTITY_TYPES.BOX;


            this.fieldController.addEntity(aBox2DEntity);

            return body;
        },


        /**
         * Updates the game
         * Creates a WorldEntityDescription which it sends to NetChannel
         */
        tick: function () {
            var delta = 16 / 1000;
            this.step(delta);

            if (this.gameTick % 30 === 0) {
                this.resetRandomBody();
            }
            // Note we call superclass's implementation after we're done
            DemoBox2D.DemoServerGame.superclass.tick.call(this);
        },

        /**
         * Resets an entity and drops it from the sky
         */
        resetRandomBody: function () {
            // Retrieve a random key, and use it to retreive an entity
            var allEntities = this.fieldController.getEntities();
            var randomKeyIndex = Math.floor(Math.random() * allEntities._keys.length);
            var entity = allEntities.objectForKey(allEntities._keys[randomKeyIndex]);

            var x = Math.random() * DemoBox2D.Constants.GAME_WIDTH + DemoBox2D.Constants.ENTITY_BOX_SIZE;
            var y = Math.random() * -15;
            entity.getBox2DBody().SetPosition(new BOX2D.b2Vec2(x, y));
        },

        step: function (delta) {
            this._world.ClearForces();
//			var delta = (typeof delta == "undefined") ? 1/this._fps : delta;
            this._world.Step(delta, delta * this._velocityIterationsPerSecond, delta * this._positionIterationsPerSecond);
        },

        shouldAddPlayer: function (aClientid, data) {
//			this.createPlayerEntity( this.getNextEntityID(), aClientid);
        },

        /**
         * @inheritDoc
         */
        shouldUpdatePlayer: function (aClientid, data) {
            var pos = new BOX2D.b2Vec2(data.payload.x, data.payload.y);
            pos.x /= DemoBox2D.Constants.PHYSICS_SCALE;
            pos.y /= DemoBox2D.Constants.PHYSICS_SCALE;

            // Loop through each entity, retrieve it's Box2D body, and apply an impulse towards the mouse position a user clicked
            this.fieldController.getEntities().forEach(function (key, entity) {
                var body = entity.getBox2DBody();
                var bodyPosition = body.GetPosition();
                var angle = Math.atan2(pos.y - bodyPosition.y, pos.x - bodyPosition.x);
                var force = 20;
                var impulse = new BOX2D.b2Vec2(Math.cos(angle) * force, Math.sin(angle) * force);
                body.ApplyImpulse(impulse, bodyPosition);
            }, this);
        },

        shouldRemovePlayer: function (aClientid) {
//			DemoBox2D.DemoServerGame.superclass.shouldRemovePlayer.call( this, aClientid );
//			console.log("DEMO::REMOVEPLAYER");
        }
    };

    // extend RealtimeMultiplayerGame.AbstractServerGame
    RealtimeMultiplayerGame.extend(DemoBox2D.DemoServerGame, RealtimeMultiplayerGame.AbstractServerGame, null);
})()