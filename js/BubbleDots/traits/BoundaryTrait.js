/**
 File:
 BoundaryTrait.js
 Created By:
 Mario Gonzalez
 Project    :
 RealtimeMultiplayerNodeJS
 Abstract:
 This trait will cause an entity to react to boundary collisions
 Basic Usage:

 */
(function () {
    BubbleDots.namespace("BubbleDots.traits");
    BubbleDots.traits.BoundaryTrait = function (aCollisionManager) {
        BubbleDots.traits.BoundaryTrait.superclass.constructor.call(this);
        this._collisionManager = aCollisionManager;
    };

    BubbleDots.traits.BoundaryTrait.prototype = {
        displayName: "BoundaryTrait",					// Unique string name for this Trait
        _boundaryRule: 0,
        _collisionManager: null,

        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.BoundaryTrait.superclass.attach.call(this, anEntity);
            this.intercept(['updatePosition']);
        },

        /**
         * Intercepted properties
         */
        updatePosition: function (speedFactor, gameClock, gameTick) {
            var trait = this.getTraitWithName("BoundaryTrait");

            // Call the original handleAcceleration
            trait._collisionManager.handleBoundaryForCircle(this.getCollisionCircle(), trait._boundaryRule);
            trait.interceptedProperties._data.updatePosition.call(this, speedFactor, gameClock, gameTick);
        },

        detach: function (force) {
            this._collisionManager = null;
            BubbleDots.traits.BoundaryTrait.superclass.detach.call(this, force);
        },

        ///// ACCESSORS
        /**
         * Set the gravitational force
         * @param {Number} aBoundaryRule Boundary rule to apply to collision circle, see CollisionManager
         */
        setBoundaryRule: function (aBoundaryRule) {
            this._boundaryRule = aBoundaryRule;
            return this;
        }
    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.BoundaryTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();