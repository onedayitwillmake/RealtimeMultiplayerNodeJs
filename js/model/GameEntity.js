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

	RealtimeMultiplayerGame.model.GameEntity = function( anEntityid, aClientid ) {
		this.clientid = aClientid;
		this.entityid = anEntityid;
		this.traits = new SortedLookupTable();
		this.position = new RealtimeMultiplayerGame.model.Point(0,0);
		return this;
	};

	RealtimeMultiplayerGame.model.GameEntity.prototype = {
		// Connection info
		clientid    : -1,														// Owner of this object
		entityid	: -1,														// UUID for this entity
		entityType	: -1,														// A special interger representing the entityType sent via along with other network info
		position	: RealtimeMultiplayerGame.model.Point.prototype.ZERO,  		// Current position of this entity
		rotation	: 0,
		traits		: null,														// A sortedlookuptable of our traits
		view		: null,
		lastReceivedEntityDescription	:null,									// The last received entity description (set by renderAtTime)

		/**
		 * Update the view's position
		 */
		updateView: function() {
			// OVERRIDE
		},

		/**
		 * Updates the position of this GameEntity based on it's movement properties (velocity, acceleration, damping)
		 * @param {Number} speedFactor	A number signifying how much faster or slower we are moving than the target framerate
		 * @param {Number} gameClock	Current game time in seconds (zero based)
		 * @param {Number} gameTick		Current game tick (incrimented each frame)
		 */
		updatePosition: function( speedFactor, gameClock, gameTick ) {
			// OVERRIDE
		},

		////// TRAIT SUPPORT
		/**
		 * Adds and attaches a trait (already created), to this entity.
		 * The trait is only attached if we do not already have one of the same type attached, or don't care (aTrait.canStack = true)
		 * @param {RealtimeMultiplayerGame.controller.traits.BaseTrait} aTrait A BaseTrait instance
		 * @return {Boolean} Whether the trait was added
		 */
		addTrait: function(aTrait) {
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
		addTraitAndExecute: function(aTrait) {
			var wasAdded = this.addTrait(aTrait);
			if(wasAdded) {
				aTrait.execute();
			}

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

			// Nothing to remove
			if(!aTrait) {
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
				returnString += "," + this.clientid;
				returnString += "," + this.entityType;
				returnString += "," + ~~(this.position.x);
				returnString += "," + ~~(this.position.y);

			return returnString;
		},

		dealloc: function() {
			this.position = null;
			this.traits.dealloc();
		},

		////// ACCESSORS
		setView: function( aView ) { this.view = aView; },
		getView: function() { return this.view; }
	}
})();