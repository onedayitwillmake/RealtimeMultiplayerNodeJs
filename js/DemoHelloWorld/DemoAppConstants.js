/**
File:
	DemoAppConstants.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS - Demo
Abstract:
	This class contains Constants used by the DemoApp in RealtimeMultiplayerGame
Basic Usage:
 	[This class is not instantiated! - below is an example of using this class by extending it]
 	var clientDropWait = RealtimeMultiplayerGame.Constants.CL_DEFAULT_MAXRATE

Version:
	1.0
*/
(function(){
	DemoApp.Constants = {
		ENTITY_DEFAULT_RADIUS	: 8,
		GAME_WIDTH				: 700,
		GAME_HEIGHT				: 450,
		MAX_CIRCLES				: 60,
		GAME_DURATION			: 1000*300,

		ENTITY_TYPES: {
			CIRCLE:	1 << 1
		}
	}
})();