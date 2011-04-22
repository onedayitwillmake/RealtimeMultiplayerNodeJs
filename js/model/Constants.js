/**
File:
	Constants.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS
Abstract:
	This class contains Constants used by RealtimeMuliplayerGame
Basic Usage:
 	[This class is not instantiated! - below is an example of using this class by extending it]
 	var clientDropWait = RealtimeMultiplayerGame.Constants.CL_DEFAULT_MAXRATE

Version:
	1.0
*/
(function(){
	RealtimeMultiplayerGame.Constants = {
		ENTITY_DEFAULT_RADIUS: 10,

		CMDS: {
			PLAYER_CONNECT		: 1 << 0,			// Initial connection to the server, not in game yet
			SERVER_MATCH_START	: 1 << 1,			// Server broadcast game start
			SERVER_END_GAME		: 1 << 2,			// Server broadcast game over
			PLAYER_JOINED		: 1 << 3,           // Player has joined the current game
			PLAYER_DISCONNECT	: 1 << 4,           // Player has disconnected
			PLAYER_UPDATE		: 1 << 5			// Player is sending sampled input
		}
	}
})();