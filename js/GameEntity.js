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
	RealtimeMultiplayerGame.GameEntity = function() {
		return this;
	};

	RealtimeMultiplayerGame.GameEntity.prototype = {
		radius: RealtimeMultiplayerGame.Constants.ENTITY_DEFAULT_RADIUS
	}
})();