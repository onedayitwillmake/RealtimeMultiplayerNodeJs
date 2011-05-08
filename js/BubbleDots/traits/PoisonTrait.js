/**
File:
	PoisonTrait.js
Created By:
	Mario Gonzalez
Project	:
	RealtimeMultiplayerNodeJS
Abstract:

 Basic Usage:

*/
(function(){
	BubbleDots.namespace("BubbleDots.traits");

	BubbleDots.traits.PoisonTrait = function() {
		BubbleDots.traits.PoisonTrait.superclass.constructor.call(this);
	};

	BubbleDots.traits.PoisonTrait.prototype = {
		displayName									: "PoisonTrait",					// Unique string name for this Trait
		originalColor								: "00FF00",
		color										: "00FF00",

		/**
		 * @inheritDoc
		 */
		attach: function(anEntity) {
			BubbleDots.traits.PoisonTrait.superclass.attach.call(this, anEntity);
			this.intercept(['onCollision', 'color', 'originalColor']);
		},

		/**
		 * @inheritDoc
		 */
		execute: function() {
		   BubbleDots.traits.PoisonTrait.superclass.execute.call(this);
		},

		/**
		 * Intercepted properties
		 */
		/**
		 * Called when this object has collided with another
		 * @param a		Object A in the collision pair, note this may be this object
		 * @param b		Object B in the collision pair, note this may be this object
		 * @param collisionNormal	A vector describing the collision
		 */
		onCollision: function(a, b, collisionNormal) {

			// We're either A or B, so perform a simple check against A to figure out which of the two objects we are
			var me = this === a ? a : b;

			BubbleDots.lib.TWEEN.remove( me._tween );
		   	me._tween = new BubbleDots.lib.TWEEN.Tween({radius: me.radius})
					.to({radius: Math.random() * 35 + 5}, 1000)
					.easing(BubbleDots.lib.TWEEN.Easing.Back.EaseOut)
					.onUpdate(function(){
				    	me.radius = ~~this.radius;
			   			me.collisionCircle.setRadius( ~~this.radius );
					})
					.start();

			me.acceleration.translatePoint( collisionNormal.multiply(-10) );
		}

	};

	// Extend BaseTrait
	RealtimeMultiplayerGame.extend( BubbleDots.traits.PoisonTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait );
})();