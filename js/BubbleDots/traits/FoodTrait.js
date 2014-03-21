/**
 File:
 FoodTrait.js
 Created By:
 Mario Gonzalez
 Project    :
 RealtimeMultiplayerNodeJS
 Abstract:

 Basic Usage:

 */
(function () {
    BubbleDots.namespace("BubbleDots.traits");

    BubbleDots.traits.FoodTrait = function () {
        BubbleDots.traits.FoodTrait.superclass.constructor.call(this);
    };

    BubbleDots.traits.FoodTrait.prototype = {
        displayName: "FoodTrait",					// Unique string name for this Trait
        color: "3",

        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.FoodTrait.superclass.attach.call(this, anEntity);
            this.intercept(['onCollision', 'color']);
        },

        /**
         * @inheritDoc
         */
        execute: function () {
            BubbleDots.traits.FoodTrait.superclass.execute.call(this);
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

//			me.addTrait( )

            BubbleDots.lib.TWEEN.remove(me._tween);
            me._tween = new BubbleDots.lib.TWEEN.Tween({radius: me.radius})
                .to({radius: 2}, 500)
                .easing(BubbleDots.lib.TWEEN.Easing.Back.EaseInOut)
                .onUpdate(function () {
                    me.setRadius(~~this.radius);
                })
                .start();

//			var newRadius = Math.max( BubbleDots.traits.FoodTrait.prototype.radius, them.radius+0.1 );
//			them.radius = newRadius;
//			them.collisionCircle.setRadius( newRadius );
            me.collisionCircle.collisionGroup = 0;
//			me.acceleration.translatePoint( collisionNormal.multiply(-10) );

            var chaseTrait = this.addTraitAndExecute(new BubbleDots.traits.ChaseTrait());
            chaseTrait.setTarget(them);
            this.addTraitAndExecute(new BubbleDots.traits.PerlinNoiseTrait());
//			me.tempColor();
        }

    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.FoodTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();