/**
 File:
 PerlinNoiseTrait.js
 Created By:
 Mario Gonzalez
 Project    :
 RealtimeMultiplayerNodeJS
 Abstract:
 Applies perlin noise to an objects velocity
 Basic Usage:

 */
(function () {
    BubbleDots.namespace("BubbleDots.traits");

    var NOISE_SEED = Math.random() * 1000;

    BubbleDots.traits.PerlinNoiseTrait = function () {
        BubbleDots.traits.PerlinNoiseTrait.superclass.constructor.call(this);
    };

    BubbleDots.traits.PerlinNoiseTrait.prototype = {
        displayName: "PerlinNoiseTraitTrait",					// Unique string name for this Trait

        /**
         * @inheritDoc
         */
        attach: function (anEntity) {
            BubbleDots.traits.PerlinNoiseTrait.superclass.attach.call(this, anEntity);
            this.intercept(['updatePosition']);
        },

        /**
         * Intercepted properties
         */
        updatePosition: function (speedFactor, gameClock, gameTick) {
            // Call the original handleAcceleration
            var trait = this.getTraitWithName("PerlinNoiseTraitTrait");

            // Modify velocity using perlin noise
            var theta = 0.008;
            var noise = RealtimeMultiplayerGame.model.noise(this.position.x * theta, this.position.y * theta, NOISE_SEED + gameTick * 0.001);
            var angle = noise * Math.PI * 12.566370614359172; // PI * 4
            var speed = 0.05;
            this.acceleration.x += Math.cos(angle) * speed;//- 0.1;
            this.acceleration.y += Math.sin(angle) * speed;

            trait.interceptedProperties._data.updatePosition.call(this, speedFactor, gameClock, gameTick);
        }
    };

    // Extend BaseTrait
    RealtimeMultiplayerGame.extend(BubbleDots.traits.PerlinNoiseTrait, RealtimeMultiplayerGame.controller.traits.BaseTrait);
})();