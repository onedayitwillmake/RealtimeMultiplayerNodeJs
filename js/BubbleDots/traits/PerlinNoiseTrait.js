/**
File:
	PerlinNoiseTrait.js
Created By:
	Mario Gonzalez
Project	:
	RealtimeMultiplayerNodeJS
Abstract:
    Applies perlin noise to an objects velocity
 Basic Usage:

*/
(function(){
	BubbleDots.namespace("BubbleDots.traits");
	BubbleDots.traits.PerlinNoiseTrait = function() {
		BubbleDots.traits.PerlinNoiseTrait.superclass.constructor.call(this);
		this.noiseOffset = 0.0;
	};

	BubbleDots.traits.PerlinNoiseTrait.prototype = {
		displayName									: "PerlinNoiseTraitTrait",					// Unique string name for this Trait
		noiseOffset									: 0.0,

		/**
	 	 * @inheritDoc
		 */
		attach: function(anEntity) {
			BubbleDots.traits.PerlinNoiseTrait.superclass.attach.call(this, anEntity);
			this.intercept(['handleAcceleration']);
		},

		/**
		 * Intercepted properties
		 */
		handleAcceleration: function() {
			// Call the original handleAcceleration
			var trait = this.getTraitWithName("PerlinNoiseTraitTrait");
			trait.noiseOffset+=0.005;

			// Modify velocity using perlin noise
			var theta = 0.007;
			var noise = RealtimeMultiplayerGame.model.noise(this.position.x*theta, this.position.y*theta, trait.noiseOffset);
			var angle = noise*12;
			var speed = 0.2;
			this.acceleration.x += Math.cos( angle ) * speed - 0.3;
			this.acceleration.y -= Math.sin( angle ) * speed;

			trait.interceptedProperties._data.handleAcceleration.call(this);
		}
	};

	// Extend BaseTrait
	RealtimeMultiplayerGame.extend( BubbleDots.traits.PerlinNoiseTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait );
})();