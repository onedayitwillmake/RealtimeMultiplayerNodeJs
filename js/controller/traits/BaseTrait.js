/**
 File:
 BaseTrait.js
 Created By:
 Mario Gonzalez
 Project    :
 RealtimeMultiplayerNodeJS
 Abstract:
 Traits work by effectively 'hi-jacking' properties of their attachedEntity.
 These properties can by functions, or non-primitive data types.

 Instead of creating a new trivial subclass, considering creating a trait and attaching it to that object

 For example to make an entity invincible for a period of time you might make a trait like this

 [PSUEDO CODE START]
 // Inside a trait subclass
 attach: function(anEntity)
 {
     this.callSuper();
     this.intercept(['onHit', 'getShotPower']);
 },

 onHit: function() {
 		// Do nothing, im invincible!
 	},

 getShotStrength: function() {
 		return 100000000; // OMGBBQ! Thats high!
 	}
 [PSUEDO CODE END]

 Be sure to call restore before detaching the trait!

 Basic Usage:

 // Let my character be controlled by the KB
 if(newEntity.connectionID === this.netChannel.connectionID) {
		aCharacter.addTraitAndExecute( new ClientControlledTrait() );
		this.clientCharacter = aCharacter;
	}
 */
(function () {
    RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.controller.traits");

    RealtimeMultiplayerGame.controller.traits.BaseTrait = function () {
        this.interceptedProperties = new SortedLookupTable();
        return this;
    };

    RealtimeMultiplayerGame.controller.traits.BaseTrait.prototype = {
        interceptedProperties: null,  					// SortedLookupTable of traits we've intercepted so they can be applied back
        attachedEntity: null,						// Trait host
        detachTimeout: 0,						// Store detach setTimeout
        displayName: "BaseTrait",				// Unique string name for this Trait

        // If a trait can stack, then it doesn't matter if it's already attached.
        // If it cannot stack, it is not applied if it's currently active.
        // For example, you can not be frozen after being frozen.
        // However you can be sped up multiple times
        canStack: false,

        /**
         * Attach the trait to the host object
         * @param anEntity
         */
        attach: function (anEntity) {
            this.attachedEntity = anEntity;
        },

        /**
         * Execute the trait
         * For example if you needed to cause an animation to start when a character is 'unfrozen', this is when you would do it
         */
        execute: function () {

        },

        /**
         * Detaches a trait from an 'attachedEntity' and restores the properties
         */
        detach: function (force) {
            clearTimeout(this.detachTimeout);
            this.restore();

            this.interceptedProperties.dealloc();
            this.interceptProperties = null;
            this.attachedEntity = null;
        },

        /**
         * Detach after N milliseconds, for example freeze trait might call this to unfreeze
         * @param aDelay
         */
        detachAfterDelay: function (aDelay) {
            var that = this;
            this.detachTimeout = setTimeout(function () {
                that.attachedEntity.removeTraitWithName(that.displayName);
            }, aDelay);
        },

        /**
         * Intercept properties from the entity we are attached to.
         * For example, if we intercept handleInput, then our own 'handleInput' function gets called.
         * We can reset all the properties by calling, this.restore();
         * @param arrayOfProperties
         */
        intercept: function (arrayOfProperties) {
            var len = arrayOfProperties.length;
            while (len--) {
                var aKey = arrayOfProperties[len];
                this.interceptedProperties.setObjectForKey(this.attachedEntity[aKey], aKey);
                this.attachedEntity[aKey] = this[aKey];
            }
        },

        /**
         * Restores traits that were intercepted.
         * Be sure to call this when removing the trait!
         */
        restore: function () {
            this.interceptedProperties.forEach(function (key, aStoredProperty) {
                this.attachedEntity[key] = aStoredProperty;
            }, this);
        }
    }
})();