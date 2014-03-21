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
(function () {
    require("../model/ImprovedNoise.js");

    DemoApp.DemoServerGame = function () {
        DemoApp.DemoServerGame.superclass.constructor.call(this);

        this.setGameDuration(DemoApp.Constants.GAME_DURATION);
        this.setupCollisionManager();
        this.setupRandomField();
        return this;
    };

    DemoApp.DemoServerGame.prototype = {
        collisionManager: null,

        /**
         * Map RealtimeMultiplayerGame.Constants.CMDS to functions
         * If ServerNetChannel does not contain a function, it will check to see if it is a special function which the delegate wants to catch
         * If it is set, it will call that CMD on its delegate
         */
        setupCmdMap: function () {
            DemoApp.DemoServerGame.superclass.setupCmdMap.call(this);
            this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE] = this.shouldUpdatePlayer;
        },

        setupCollisionManager: function () {
            // Collision simulation
            this.collisionManager = new RealtimeMultiplayerGame.modules.circlecollision.CircleManager();
            this.collisionManager.setBounds(0, 0, DemoApp.Constants.GAME_WIDTH, DemoApp.Constants.GAME_HEIGHT);
            this.collisionManager.setNumberOfCollisionPasses(2);
            this.collisionManager.setNumberOfTargetingPasses(0);
            this.collisionManager.setCallback(this.onCollisionManagerCollision, this);
        },

        /**
         * Called when the collision manager detects a collision
         */
        onCollisionManagerCollision: function (ci, cj, v) {
            ci.delegate.tempColor();
            cj.delegate.tempColor();
        },

        /**
         * Randomly places some CircleEntities into game
         */
        setupRandomField: function () {
            //RealtimeMultiplayerGame.model.noise(10, 10, i/total)
            var total = DemoApp.Constants.MAX_CIRCLES;
            for (var i = 0; i < total; i++) {
                var radius = DemoApp.Constants.ENTITY_DEFAULT_RADIUS + Math.random() * 5;
                this.createCircleEntity(radius, this.getNextEntityID(), RealtimeMultiplayerGame.Constants.SERVER_SETTING.CLIENT_ID);
            }
        },

        /**
         * Helper method to create a single CircleEntity
         * @param {Number} aRadius
         * @param {Number} anEntityid
         * @param {Number} aClientid
         */
        createCircleEntity: function (aRadius, anEntityid, aClientid) {
            // Create a randomly sized circle, that will represent this entity in the collision manager
            var collisionCircle = new RealtimeMultiplayerGame.modules.circlecollision.PackedCircle();
            collisionCircle.setRadius(aRadius);

            // Create the GameEntity
            var circleEntity = new DemoApp.CircleEntity(anEntityid, aClientid);
            circleEntity.radius = aRadius;
            circleEntity.position.set(Math.random() * DemoApp.Constants.GAME_WIDTH, Math.random() * DemoApp.Constants.GAME_HEIGHT);
            circleEntity.setCollisionCircle(collisionCircle);

            // Place the circle and collision circle into corresponding containers
            this.collisionManager.addCircle(circleEntity.getCollisionCircle());
            this.fieldController.addEntity(circleEntity);

            circleEntity.entityType = DemoApp.Constants.ENTITY_TYPES.GENERIC_CIRCLE;
            return circleEntity;
        },

        createPlayerEntity: function (anEntityid, aClientid) {
            // Create the GameEntity
            var playerEntity = new DemoApp.PlayerEntity(anEntityid, aClientid);
            playerEntity.position.set(Math.random() * DemoApp.Constants.GAME_WIDTH, Math.random() * DemoApp.Constants.GAME_HEIGHT);

            var collisionCircle = new RealtimeMultiplayerGame.modules.circlecollision.PackedCircle();
            collisionCircle.setRadius(playerEntity.radius);

            playerEntity.setInput(new RealtimeMultiplayerGame.Input.Keyboard());
            playerEntity.setCollisionCircle(collisionCircle);

            // place player on field
            this.collisionManager.addCircle(playerEntity.getCollisionCircle());
            this.fieldController.addPlayer(playerEntity);

            return playerEntity;
        },

        /**
         * Updates the game
         * Creates a WorldEntityDescription which it sends to NetChannel
         */
        tick: function () {
            // Use both the BOUNDARY_WRAP_X flag, and the BOUNDARY_CONSTRAIN_Y flags as the rule
            var boundsRule = RealtimeMultiplayerGame.modules.circlecollision.CircleManager.prototype.BOUNDARY_WRAP_X;
            boundsRule |= RealtimeMultiplayerGame.modules.circlecollision.CircleManager.prototype.BOUNDARY_CONSTRAIN_Y;

            this.collisionManager.handleBoundaryForAllCircles(boundsRule);
            this.collisionManager.handleCollisions();

            // Note we call superclass's implementation after we're done
            DemoApp.DemoServerGame.superclass.tick.call(this);
        },

        shouldAddPlayer: function (aClientid, data) {
            this.createPlayerEntity(this.getNextEntityID(), aClientid);
        },

        shouldUpdatePlayer: function (aClientid, data) {
            var entity = this.fieldController.getEntityWithid(data.payload.entityid);
            entity.input.deconstructInputBitmask(data.payload.input);
        },

        shouldRemovePlayer: function (aClientid) {
            DemoApp.DemoServerGame.superclass.shouldRemovePlayer.call(this, aClientid);
            console.log("DEMO::REMOVEPLAYER");
        }
    };

    // extend RealtimeMultiplayerGame.AbstractServerGame
    RealtimeMultiplayerGame.extend(DemoApp.DemoServerGame, RealtimeMultiplayerGame.AbstractServerGame, null);
})();