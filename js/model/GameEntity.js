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
		this.position = RealtimeMultiplayerGame.model.Point(0,0);
		return this;
	};

	RealtimeMultiplayerGame.model.GameEntity.prototype = {
		position	: null,
		radius		: RealtimeMultiplayerGame.Constants.ENTITY_DEFAULT_RADIUS
	}
})();