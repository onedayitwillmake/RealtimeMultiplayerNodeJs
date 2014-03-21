/**
 File:
 BubbleDots.CircleEntity
 Created By:
 Mario Gonzalez
 Project:
 BubbleDots
 Abstract:
 This is the base entity for the demo game
 Basic Usage:

 Version:
 1.0
 */
(function () {
    var count = 0;
    BubbleDots.PlayerEntity = function (anEntityid, aClientid) {
        BubbleDots.PlayerEntity.superclass.constructor.call(this, anEntityid, aClientid);
        this.entityType = BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY;
        this.initThrust();
    };

    BubbleDots.PlayerEntity.prototype = {
        _isThrusting: false,		// We need a better variable name.
        _thrustLevel: 0,

        THRUST_DECREMENT: 0.001,		// How much to decrease thrust by
        THRUST_FORCE: 0.3,			// How much force to apply every tick when applying thrust

        initThrust: function () {
            this._thrustLevel = 100.0;
            this._isThrusting = false;
        },

        startThrust: function () {
            this._isThrusting = true;
//			this.velocity.y *= 0.5;
        },

        applyThrust: function () {
            this._thrustLevel -= BubbleDots.PlayerEntity.prototype.THRUST_DECREMENT;
            if (this._thrustLevel > 0.0) {
                this.acceleration.y -= BubbleDots.PlayerEntity.prototype.THRUST_FORCE;
            }
        },

        stopThrust: function () {
            this._isThrusting = false;
        },

        /**
         * Update position of this entity - this is only called on the serverside
         * @param {Number} speedFactor    A number signifying how much faster or slower we are moving than the target framerate
         * @param {Number} gameClock    Current game time in seconds (zero based)
         * @param {Number} gameTick        Current game tick (incrimented each frame)
         */
        updatePosition: function (speedFactor, gameClock, gameTick) {
            this.handleInput(speedFactor);
            BubbleDots.PlayerEntity.superclass.updatePosition.call(this, speedFactor, gameClock, gameTick);
        },

        handleInput: function (speedFactor) {
            var moveSpeed = 0.2;

            if (this.input.isLeft()) this.acceleration.x -= moveSpeed;
            if (this.input.isRight()) this.acceleration.x += moveSpeed;
            if (this.input.isDown()) this.acceleration.y += moveSpeed;

            // We're pressing up - apply thrust...
            // Call startThrust if we were not thrusting before
            if (this.input.isUp()) {
                if (!this._isThrusting) {
                    this.startThrust();
                }

                this.applyThrust();
            } else if (this._isThrusting) {
                this.stopThrust();
            } else { // Default behavior - increase _thrustLevel
                this._thrustLevel += BubbleDots.PlayerEntity.prototype.THRUST_DECREMENT * 2;
                this._thrustLevel = Math.min(this._thrustLevel, 100);
            }
        },

        ///// ACCESSORS
        /**
         * Set the CollisionCircle for this game entity.
         * @param aCollisionCircle
         */
        setCollisionCircle: function (aCollisionCircle) {
            BubbleDots.PlayerEntity.superclass.setCollisionCircle.call(this, aCollisionCircle);
            this.collisionCircle.collisionMask = 2;
            this.collisionCircle.collisionGroup = 1;
            this.collisionCircle.isFixed = true;
        },
        setInput: function (input) {
            this.input = input;
        }
    };

    // extend RealtimeMultiplayerGame.model.GameEntity
    RealtimeMultiplayerGame.extend(BubbleDots.PlayerEntity, BubbleDots.CircleEntity, null);
})();