/**
 File:
 GravityTrait.js
 Created By:
 Mario Gonzalez
 Project    :
 RealtimeMultiplayerNodeJS
 Abstract:
 This trait will cause an entity to chase a target
 Basic Usage:

 */
(function () {
    BubbleDots.namespace("BubbleDots.traits");
    var RATE = 0.2;
    BubbleDots.traits.GravityTrait = function () {
        BubbleDots.traits.GravityTrait.superclass.constructor.call(this);
        this._force = BubbleDots.traits.GravityTrait.prototype.DEFAULT_FORCE;
    };

    BubbleDots.traits.GravityTrait.prototype = {
        displayName: "GravityTrait",					// Unique string name for this Trait

        _force: 0,

        DEFAULT_FORCE: 0.21,

        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.GravityTrait.superclass.attach.call(this, anEntity);
            this.intercept(['updatePosition']);
        },

        /**
         * Intercepted properties
         */
        updatePosition: function (speedFactor, gameClock, gameTick) {
            var trait = this.getTraitWithName("GravityTrait");

            this.acceleration.y += trait._force * speedFactor;
            // Call the original handleAcceleration
            trait.interceptedProperties._data.updatePosition.call(this, speedFactor, gameClock, gameTick);
        },

        ///// ACCESSORS
        /**
         * Set the gravitational force
         * @param {Number} force Strength of gravity in Y axis
         */
        setForce: function (force) {
            this._force = force
        }
    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.GravityTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();