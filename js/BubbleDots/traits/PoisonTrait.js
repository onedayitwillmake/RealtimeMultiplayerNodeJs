/**
 File:
 PoisonTrait.js
 Created By:
 Mario Gonzalez
 Project    :
 RealtimeMultiplayerNodeJS
 Abstract:

 Basic Usage:

 */
(function () {
    BubbleDots.namespace("BubbleDots.traits");

    BubbleDots.traits.PoisonTrait = function () {
        BubbleDots.traits.PoisonTrait.superclass.constructor.call(this);
    };

    BubbleDots.traits.PoisonTrait.prototype = {
        displayName: "PoisonTrait",					// Unique string name for this Trait
        color: "2",

        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.PoisonTrait.superclass.attach.call(this, anEntity);
            this.intercept(['onCollision', 'color']);
        },

        /**
         * @inheritDoc
         */
        execute: function () {
            BubbleDots.traits.PoisonTrait.superclass.execute.call(this);
        },

        /**
         * Intercepted properties
         */
        /**
         * Called when this object has collided with another
         * @param a        Object A in the collision pair, note this may be this object
         * @param b        Object B in the collision pair, note this may be this object
         * @param collisionNormal    A vector describing the collision
         */
        onCollision: function (a, b, collisionNormal) {
            // We're either A or B, so perform a simple check against A to figure out which of the two objects we are
            var me = this === a ? a : b;
            var them = this === a ? b : a;

//			var newRadius = Math.max( 0.1, them.radius-0.5 );
//			them.radius = newRadius;
//			them.collisionCircle.setRadius( newRadius );

            them.acceleration.translatePoint(collisionNormal.multiply(them.velocityMax * 0.9));
        }

    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.PoisonTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();