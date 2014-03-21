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
(function () {
    require("../model/ImprovedNoise.js");
    require("./lib/color.js");
    require("./lib/Tween.js");

    BubbleDots.DemoServerGame = function () {
        BubbleDots.DemoServerGame.superclass.constructor.call(this);

        this.setGameDuration(BubbleDots.Constants.GAME_DURATION);
        this.setupCollisionManager();
        this.setupRandomField();

        return this;
    };

    BubbleDots.DemoServerGame.prototype = {
        collisionManager: null,

        /**
         * Map RealtimeMultiplayerGame.Constants.CMDS to functions
         * If ServerNetChannel does not contain a function, it will check to see if it is a special function which the delegate wants to catch
         * If it is set, it will call that CMD on its delegate
         */
        setupCmdMap: function () {
            BubbleDots.DemoServerGame.superclass.setupCmdMap.call(this);
            this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE] = this.shouldUpdatePlayer;
        },

        /**
         * Sets up the collision manager
         */
        setupCollisionManager: function () {
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
        onCollisionManagerCollision: function (ci, cj, v) {
            ci.delegate.onCollision(ci.delegate, cj.delegate, v.clone());
            cj.delegate.onCollision(ci.delegate, cj.delegate, v.clone());
        },

        /**
         * Randomly places some CircleEntities into game
         */
        setupRandomField: function () {
            //RealtimeMultiplayerGame.model.noise(10, 10, i/total)
            var total = BubbleDots.Constants.MAX_CIRCLES;
            for (var i = 0; i < total; i++) {
                var radius = BubbleDots.Constants.ENTITY_DEFAULT_RADIUS;
                var entity = this.createEntity(BubbleDots.CircleEntity, radius, this.getNextEntityID(), RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID);

                // Randomly make the object 'food' or 'poison'
                if (i % 5 === 0) {
                    entity.addTraitAndExecute(new BubbleDots.traits.PoisonTrait());
                } else {
                    entity.addTraitAndExecute(new BubbleDots.traits.FoodTrait());
                }

//				entity.addTraitAndExecute( new BubbleDots.traits.PerlinNoiseTrait() );
            }
        },

        /**
         * Helper method to create a single CircleEntity
         * @param {Number} aRadius
         * @param {Number} anEntityid
         * @param {Number} aClientid
         */
        createEntity: function (aBubbleDotEntityConstructor, aRadius, anEntityid, aClientid) {
            // Create the GameEntity
            var circleEntity = new aBubbleDotEntityConstructor(anEntityid, aClientid);
            circleEntity.position.set(Math.random() * BubbleDots.Constants.GAME_WIDTH * 20, Math.random() * BubbleDots.Constants.GAME_HEIGHT);

            // Create a randomly sized circle, that will represent this entity in the collision manager
            var collisionCircle = new RealtimeMultiplayerGame.modules.circlecollision.PackedCircle();
            circleEntity.setCollisionCircle(collisionCircle);
            circleEntity.setRadius(aRadius);

            // Place the circle and collision circle into corresponding containers
            this.collisionManager.addCircle(circleEntity.getCollisionCircle());
            this.fieldController.addEntity(circleEntity);

            return circleEntity;
        },

        /**
         * @inheritDoc
         */
        tick: function () {
            this.collisionManager.handleCollisions();
            BubbleDots.lib.TWEEN.update();

//			var boundaryRule = RealtimeMultiplayerGame.modules.circlecollision.CircleManager.prototype.BOUNDARY_CONSTRAIN_Y;
//			var that = this;
//			this.fieldController.getPlayers().forEach(function(key, value) {
//				this.collisionManager.handleBoundaryForCircle( value.getCollisionCircle(), boundaryRule );
//			}, this);

            // Note we call superclass's implementation after we're done
            BubbleDots.DemoServerGame.superclass.tick.call(this);
        },

        /**
         * @inheritDoc
         */
        shouldAddPlayer: function (aClientid, data) {
            var center = new RealtimeMultiplayerGame.model.Point(BubbleDots.Constants.GAME_WIDTH / 2, BubbleDots.Constants.GAME_HEIGHT / 2);
            var playerEntity = this.createEntity(BubbleDots.PlayerEntity, BubbleDots.Constants.ENTITY_DEFAULT_RADIUS, this.getNextEntityID(), aClientid);
            playerEntity.position = center.clone();
            playerEntity.getCollisionCircle().setPosition(center.clone());
            playerEntity.setInput(new RealtimeMultiplayerGame.Input.Keyboard());
            playerEntity.setColor("4");

            playerEntity.addTraitAndExecute(new BubbleDots.traits.GravityTrait());

            // Set the boundary trait and the rule it will use
            var boundaryTrait = new BubbleDots.traits.BoundaryTrait(this.collisionManager);
            boundaryTrait.setBoundaryRule(RealtimeMultiplayerGame.modules.circlecollision.CircleManager.prototype.BOUNDARY_CONSTRAIN_Y);
            playerEntity.addTraitAndExecute(boundaryTrait);

            this.fieldController.addPlayer(playerEntity);
        },

        /**
         * @inheritDoc
         */
        shouldUpdatePlayer: function (aClientid, data) {
            var entity = this.fieldController.getEntityWithid(data.payload.entityid);
            entity.input.deconstructInputBitmask(data.payload.input);
        },

        /**
         * @inheritDoc
         */
        shouldRemovePlayer: function (aClientid) {
            var entity = this.fieldController.getPlayerWithid(aClientid);
            if (entity) {
                this.collisionManager.removeCircle(entity.getCollisionCircle());
            }

            BubbleDots.DemoServerGame.superclass.shouldRemovePlayer.call(this, aClientid);
        }
    };

    // extend RealtimeMultiplayerGame.AbstractServerGame
    RealtimeMultiplayerGame.extend(BubbleDots.DemoServerGame, RealtimeMultiplayerGame.AbstractServerGame, null);
})();