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
(function () {
    BubbleDots.Constants = {
        ENTITY_DEFAULT_RADIUS: 17,
        GAME_WIDTH: 700,
        GAME_HEIGHT: 450,
        MAX_CIRCLES: 200,
        GAME_DURATION: 1000 * 300,

        ENTITY_TYPES: {
            CANDY_ENTITY: 1 << 0,
            PLAYER_ENTITY: 1 << 1
        },

        IMAGE_ASSETS: [
            {id: "particle" + 1, url: "assets/bubbledots/blueParticle.png"},
            {id: "particle" + 2, url: "assets/bubbledots/redParticle.png"},
            {id: "particle" + 3, url: "assets/bubbledots/greenParticle.png"},
            {id: "particle" + 4, url: "assets/bubbledots/yellowParticle.png"},
            {id: "ground", url: "assets/bubbledots/ground.png"}
        ]
    }
})();