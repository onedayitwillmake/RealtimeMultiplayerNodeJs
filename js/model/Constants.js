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
 */
(function () {
    RealtimeMultiplayerGame.Constants = {
        DEBUG_SETTING: {
            SERVER_NETCHANNEL_DEBUG: true,
            CLIENT_NETCHANNEL_DEBUG: true
        },

        SERVER_SETTING: {
            CLIENT_ID: 0,						// If an object has a client id of zero, that means it is owned by the server
            SOCKET_PROTOCOL: "http",
            SOCKET_DOMAIN: "localhost",
            SOCKET_PORT: 8081,

            /** @return {string} */
            GET_URI: function () {
                return  RealtimeMultiplayerGame.Constants.SERVER_SETTING.SOCKET_PROTOCOL
                    + "://" + RealtimeMultiplayerGame.Constants.SERVER_SETTING.SOCKET_DOMAIN
                    + ":" + RealtimeMultiplayerGame.Constants.SERVER_SETTING.SOCKET_PORT;
            }
        },

        CLIENT_SETTING: {
            INTERP: 75,						// How far back to interpolate the client-rendered world
            FAKE_LAG: 0,						// Used to simulate latency
            UPDATE_RATE: Math.round(1000 / 30), 					// How often to request a world-update from the server
            CMD_RATE: Math.round(1000 / 31),                  // How often a client can send messages to server
            MAX_BUFFER: 64,
            EXPIRED_ENTITY_CHECK_RATE: 30,		// How often we clear out entities that the server says no longer exist. Lower looks better but decreases framerate
            MAX_UPDATE_FAILURE_COUNT: 3			// How many times we allow ourselves to fail when getting behind the server time
        },

        CMDS: {
            SERVER_CONNECT: 1 << 1,			// Dispatched by the server if it acknowledges a client connection
            SERVER_MATCH_START: 1 << 2,			// Server broadcast game start
            SERVER_END_GAME: 1 << 3,			// Server broadcast game over
            PLAYER_CONNECT: 1 << 4,			// Initial connection to the server, not in game yet
            PLAYER_JOINED: 1 << 5,           // Player has joined the current game
            PLAYER_DISCONNECT: 1 << 6,           // Player has disconnected
            PLAYER_UPDATE: 1 << 7,			// Player is sending sampled input
            SERVER_FULL_UPDATE: 1 << 8			// Player is sending sampled input
        },

        // The client sends this bitmask to the server
        // See (Keyboard.js)
        INPUT_BITMASK: {
            UP: 1 << 0,
            DOWN: 1 << 1,
            LEFT: 1 << 2,
            RIGHT: 1 << 3,
            SPACE: 1 << 4,
            SHIFT: 1 << 5,
            TAB: 1 << 6
        }
    }
})();