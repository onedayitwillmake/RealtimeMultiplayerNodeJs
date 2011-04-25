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
		return this;
	};

	RealtimeMultiplayerGame.model.GameEntity.prototype = {
		position	: RealtimeMultiplayerGame.model.Point.prototype.ZERO,  		// Current position of this entity
		clientid    : -1,														// Owner of this object
		entityid	: -1,														// UUID for this entity
		radius		: RealtimeMultiplayerGame.Constants.ENTITY_DEFAULT_RADIUS,	// Generic property, to remove


		/**
		 * Construct an entity description for this object, it is essentually a CSV so you have to know how to read it on the receiving end
		 * @param wantsFullUpdate	If true, certain things that are only sent when changed are always sent
		 */
		constructEntityDescription: function(gameTick, wantsFullUpdate)
		{
			var returnString = this.objectID;
				returnString += ","+this.clientID;
				returnString += ","+this.entityType;
				returnString += ","+this.theme;
				returnString += ","+this.themeMask; // Used to send stuff like whether we have a trait - and which trait for example
				returnString += ","+Math.round(this.position.x);
				returnString += ","+Math.round(this.position.y);
				returnString += ","+Math.round(this.rotation*57.2957795);

			return returnString;
		}
	}
})();