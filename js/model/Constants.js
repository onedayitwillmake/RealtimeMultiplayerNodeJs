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

		DEBUG_SETTING:
		{
			SERVER_NETCHANNEL_DEBUG : true,
			CLIENT_NETCHANNEL_DEBUG : true
		},

		SERVER_SETTING:
		{
			SOCKET_PORT	: 8080
		},

		CLIENT_SETTING:
		{
			UPDATE_RATE	: 1000/25, 					// How often to request a world-update from the server
			CMD_RATE	: 1000/30,                  // How often a client can send messages to server
			MAX_BUFFER	: 31
		},

		CMDS: {
			SERVER_CONNECT		: 1 << 1,			// Dispatched by the server if it acknowledges a client connection
			SERVER_MATCH_START	: 1 << 2,			// Server broadcast game start
			SERVER_END_GAME		: 1 << 3,			// Server broadcast game over
			PLAYER_CONNECT		: 1 << 4,			// Initial connection to the server, not in game yet
			PLAYER_JOINED		: 1 << 5,           // Player has joined the current game
			PLAYER_DISCONNECT	: 1 << 6,           // Player has disconnected
			PLAYER_UPDATE		: 1 << 7			// Player is sending sampled input
		},


		// The client sends this bitmask to the server
		// See (Keyboard.js)
		INPUT_BITMASK:
		{
			UP		: 1 << 0,
			DOWN	: 1 << 1,
			LEFT	: 1 << 2,
			RIGHT	: 1 << 3,
			SPACE	: 1 << 4,
			SHIFT	: 1 << 5,
			TAB		: 1 << 6
		}
	}
})();