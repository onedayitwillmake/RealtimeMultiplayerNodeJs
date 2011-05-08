/**
File:
	BubbleDotsConstants.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS - Demo
Abstract:
	This class contains Constants used by the BubbleDots in RealtimeMultiplayerGame
Basic Usage:
 	[This class is not instantiated! - below is an example of using this class by extending it]
 	var clientDropWait = RealtimeMultiplayerGame.Constants.CL_DEFAULT_MAXRATE

Version:
	1.0
*/
(function(){
	BubbleDots.Constants = {
		ENTITY_DEFAULT_RADIUS	: 8,
		GAME_WIDTH				: 700,
		GAME_HEIGHT				: 450,
		MAX_CIRCLES				: 50,
		GAME_DURATION			: 1000*300,

		ENTITY_TYPES: {
			CANDY_ENTITY:	1 << 0,
			PLAYER_ENTITY:	1 << 1
		}
	}
})();