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

Version:
	1.0
*/
(function(){
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.model");

	RealtimeMultiplayerGame.model.GameEntity = function() {
		this.traits = new SortedLookupTable();
		return this;
	};

	RealtimeMultiplayerGame.model.GameEntity.prototype = {
		// Connection info
		clientid    : -1,														// Owner of this object
		entityid	: -1,														// UUID for this entity
		entityType	: -1,

		// Physical info
		position	: RealtimeMultiplayerGame.model.Point.prototype.ZERO,  		// Current position of this entity
		radius		: RealtimeMultiplayerGame.Constants.ENTITY_DEFAULT_RADIUS,	// Generic property, to remove
		// Meta info
		traits		: null,														// A sortedlookuptable of our traits

	/**
		 * Update, use delta to create frame independent motion
		 * @param speedFactor	A normalized value our ACTUAL framerate vs our desired framerate. 1.0 means exactly correct, 0.5 means we're running at half speed
		 * @param gameClock		The current gameclock
		 */
		tick: function(speedFactor, gameClock) {
			if(this.view) {
				this.view.update();
			} else {
				this.updatePosition(speedFactor);
			}
		},

		/**
		 * Updates the position of this GameEntity based on it's movement properties (velocity, acceleration, damping)
		 * @param speedFactor Float for considering framerate speedFactor, 1.0 means perfectly accurate.
		 */
		updatePosition: function(speedFactor) {
		},

		////// TRAIT SUPPORT
		/**
		 * Adds and attaches a trait (already created), to this entity.
		 * The trait is only attached if we already have one of the same type attached, or don't care (aTrait.canStack = true)
		 * @param {BaseTrait} aTrait A BaseTrait instance
		 * @return {Boolean} Whether the trait was added
		 */
		addTrait: function(aTrait)
		{
			// Check if we already have this trait, if we do - make sure the trait allows stacking
			var existingVersionOfTrait = this.getTraitWithName(aTrait.displayName);
			if(existingVersionOfTrait && !existingVersionOfTrait.canStack) {
				return false;
			}

			//
			this.removeTraitWithName(aTrait.displayName);
			this.traits.setObjectForKey(aTrait, aTrait.displayName);
			aTrait.attach(this);

			return true;
		},

		/**
		 * Calls addTrait and executes it immediately
		 * @param aTrait
		 */
		addTraitAndExecute: function(aTrait)
		{
			var wasAdded = this.addTrait(aTrait);
			if(wasAdded) { aTrait.execute(); }

			return wasAdded;
		},

		/**
		 * Returns a trait with a matching .displayName property
		 * @param aTraitName
		 */
		getTraitWithName: function(aTraitName) { return this.traits.objectForKey(aTraitName) },

		/**
		 * Removes a trait with a matching .displayName property
		 * @param aTraitName
		 */
		removeTraitWithName: function(aTraitName)
		{
			if(!this.traits) { throw "This GameEntity does not have a 'traits' property - race condition?" }; // CATCH ERROR DURING DEVELOPMENT

			var aTrait = this.traits.objectForKey(aTraitName);
			if(!aTrait) {
				console.log("(GameEntity)::removeTraitWithName - trait not found!");
				return;
			}

			aTrait.detach();
			this.traits.remove(aTraitName);
		},

		/**
		 * Construct an entity description for this object, it is essentually a CSV so you have to know how to read it on the receiving end
		 * @param wantsFullUpdate	If true, certain things that are only sent when changed are always sent
		 */
		constructEntityDescription: function(gameTick, wantsFullUpdate)
		{
			var returnString = this.entityid;
				returnString += ","+this.clientid;
				returnString += ","+this.entityType;
				returnString += ","+Math.round(this.position.x);
				returnString += ","+Math.round(this.position.y);
				returnString += ","+Math.round(this.rotation*57.2957795);

			return returnString;
		},

		dealloc: function() {
			this.position = null;
			this.traits.dealloc();
		}
	}
})();