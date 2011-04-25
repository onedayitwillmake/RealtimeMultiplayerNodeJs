/**
File:
	WorldEntityDescription.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS
Abstract:
	A WorldEntityDescription is a full description of the current world state.

 	AbstractServerGame creates this each 'tick'
 		-> NetChannel passes it to each Client
 			-> Each client performs 'delta compression' to remove unchanged entities from being sent
 				-> If ready, each client sends the customized WorldEntityDescription to it's connection
Basic Usage:
	// Create a new world-entity-description, could be some room for optimization here but it only happens once per game loop anyway
	var worldEntityDescription = new WorldEntityDescription( this );
	this.netChannel.tick( this.gameClock, worldEntityDescription );

Version:
	1.0
*/
(function(){
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.model");

	RealtimeMultiplayerGame.model.WorldEntityDescription = function( aGameInstance, allEntities ) {
		this.entities = allEntities;
		this.gameClock = aGameInstance.getGameClock();
		this.gameTick = aGameInstance.getGameTick();
		return this;
	};

	RealtimeMultiplayerGame.model.WorldEntityDescription.prototype = {
		entities	: null,
		gameClock	: 0,
		gameTick	: 0
	}
})();