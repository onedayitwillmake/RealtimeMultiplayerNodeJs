/**
 File:
 GameEntity.js
 Created By:
 Mario Gonzalez
 Project:
 RealtimeMultiplayerNodeJS
 Abstract:
 This class is the base GameEntity class in RealtimeMultiplayerGame, it contains a position rotation, health
 Basic Usage:

 var badGuy = new RealtimeMultiplayerGame.GameEntity();
 badGuy.position.x += 1;
 */
(function () {
    RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.model");

    RealtimeMultiplayerGame.model.GameEntity = function (anEntityid, aClientid) {
        this.clientid = aClientid;
        this.entityid = anEntityid;
        this.traits = [];
        this.position = new RealtimeMultiplayerGame.model.Point(0, 0);
        return this;
    };

    RealtimeMultiplayerGame.model.GameEntity.prototype = {
        // Connection info
        clientid: -1,														// Owner of this object
        entityid: -1,														// UUID for this entity
        entityType: -1,														// A special interger representing the entityType sent via along with other network info
        position: RealtimeMultiplayerGame.model.Point.prototype.ZERO,  		// Current position of this entity
        rotation: 0,
        traits: null,														// An array of our traits, in reverse added order
        view: null,
        lastReceivedEntityDescription: null,									// The last received entity description (set by renderAtTime)

        /**
         * Update the view's position
         */
        updateView: function () {
            // OVERRIDE
        },

        /**
         * Updates the position of this GameEntity based on it's movement properties (velocity, acceleration, damping)
         * @param {Number} speedFactor    A number signifying how much faster or slower we are moving than the target framerate
         * @param {Number} gameClock    Current game time in seconds (zero based)
         * @param {Number} gameTick        Current game tick (incrimented each frame)
         */
        updatePosition: function (speedFactor, gameClock, gameTick) {
            // OVERRIDE
        },

        /**
         * Construct an entity description for this object, it is essentually a CSV so you have to know how to read it on the receiving end
         * @param wantsFullUpdate    If true, certain things that are only sent when changed are always sent
         */
        constructEntityDescription: function (gameTick, wantsFullUpdate) {
            // Note: "~~" is just a way to round the value without the Math.round function call
            var returnString = this.entityid;
            returnString += "," + this.clientid;
            returnString += "," + this.entityType;
            returnString += "," + ~~this.position.x;
            returnString += "," + ~~this.position.y;

            return returnString;
        },

        ////// TRAIT SUPPORT
        /**
         * Adds and attaches a trait (already created), to this entity.
         * The trait is only attached if we do not already have one of the same type attached, or don't care (aTrait.canStack = true)
         * @param {RealtimeMultiplayerGame.controller.traits.BaseTrait} aTrait A BaseTrait instance
         * @return {Boolean} Whether the trait was added
         */
        addTrait: function (aTrait) {
            // Check if we already have this trait, if we do - make sure the trait allows stacking
            var existingVersionOfTrait = this.getTraitWithName(aTrait.displayName);
            if (existingVersionOfTrait && !existingVersionOfTrait.canStack) {
                return false;
            }

            // Remove existing version
            if (existingVersionOfTrait) {
                this.removeTraitWithName(aTrait.displayName);
            }


            this.traits.push(aTrait);
            aTrait.attach(this);

            return aTrait;
        },

        /**
         * Calls addTrait and executes it immediately
         * @param aTrait
         */
        addTraitAndExecute: function (aTrait) {
            var wasAdded = this.addTrait(aTrait);
            if (wasAdded) {
                aTrait.execute();
                return aTrait;
            }

            return null;
        },

        /**
         * Removes a trait with a matching .displayName property
         * @param aTraitName
         */
        removeTraitWithName: function (aTraitName) {
            var len = this.traits.length;
            var removedTraits = null;
            for (var i = 0; i < len; ++i) {
                if (this.traits[i].displayName === aTraitName) {
                    removedTraits = this.traits.splice(i, 1);
                    break;
                }
            }

            // Detach removed traits
            if (removedTraits) {
                i = removedTraits.length;
                while (i--) {
                    removedTraits[i].detach();
                }
            }
        },

        /**
         * Removes all traits contained in this entity
         */
        removeAllTraits: function () {
            var i = this.traits.length;
            while (i--) {
                this.traits[i].detach();
            }

            this.traits = [];
        },

        ///// MEMORY
        dealloc: function () {
            this.position = null;
            this.removeAllTraits();
            this.traits = null;
        },

        ////// ACCESSORS
        setView: function (aView) {
            this.view = aView;
        },
        getView: function () {
            return this.view;
        },
        /**
         * Returns a trait with a matching .displayName property
         * @param aTraitName
         */
        getTraitWithName: function (aTraitName) {
            var len = this.traits.length;
            var trait = null;
            for (var i = 0; i < len; ++i) {
                if (this.traits[i].displayName === aTraitName) {
                    trait = this.traits[i];
                    break;
                }
            }
            return trait;
        }
    }
})();