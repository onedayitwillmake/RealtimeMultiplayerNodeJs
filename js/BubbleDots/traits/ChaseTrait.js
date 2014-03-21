/**
 File:
 ChaseTrait.js
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
    BubbleDots.traits.ChaseTrait = function () {
        BubbleDots.traits.ChaseTrait.superclass.constructor.call(this);
    };

    BubbleDots.traits.ChaseTrait.prototype = {
        displayName: "ChaseTrait",					// Unique string name for this Trait
        chaseSpeed: 0.01,
        radius: 40,
        target: RealtimeMultiplayerGame.model.Point.prototype.ZERO,
        offset: RealtimeMultiplayerGame.model.Point.prototype.ZERO,

        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.ChaseTrait.superclass.attach.call(this, anEntity);
            this.intercept(['updatePosition']);
        },

        /**
         * @inheritDoc
         */
        execute: function () {
            RATE += 0.3;
            this.radius = Math.random() * 20 + 10;
            this.offset = new RealtimeMultiplayerGame.model.Point(Math.cos(RATE) * this.radius, Math.sin(RATE) * -this.radius);
            this.chaseSpeed = Math.random() * 0.02 + 0.001;
            BubbleDots.traits.ChaseTrait.superclass.execute.call(this);
        },

        /**
         * Intercepted properties
         */
        updatePosition: function (speedFactor, gameClock, gameTick) {
            var trait = this.getTraitWithName("ChaseTrait");

            // Move towards the target position overtime
            var delta = trait.target.position.subtractClone(this.position);
            delta.x += trait.offset.x;
            delta.y += trait.offset.y;

            delta.multiply(trait.chaseSpeed);
            this.acceleration.translatePoint(delta);

            // Call the original handleAcceleration
            trait.interceptedProperties._data.updatePosition.call(this, speedFactor, gameClock, gameTick);
        },

        ///// ACCESSORS
        /**
         * Set the target this object will follow
         * @param {RealtimeMultiplayerGame.model.GameEntity} aTarget
         */
        setTarget: function (aTarget) {
            this.target = aTarget;
        }
    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.ChaseTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();