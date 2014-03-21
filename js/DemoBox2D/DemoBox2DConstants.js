/**
 File:
 DemoBox2DConstants.js
 Created By:
 Mario Gonzalez
 Project:
 RealtimeMultiplayerNodeJS - Demo
 Abstract:
 This class contains Constants used by the DemoBox2D in RealtimeMultiplayerGame
 Basic Usage:
 [This class is not instantiated! - below is an example of using this class by extending it]
 var clientDropWait = RealtimeMultiplayerGame.Constants.CL_DEFAULT_MAXRATE

 Version:
 1.0
 */
(function () {
    DemoBox2D.Constants = {
        ENTITY_DEFAULT_RADIUS: 8,
        ENTITY_BOX_SIZE: 16,
        PHYSICS_SCALE: 32,
        GAME_WIDTH: 700,
        GAME_HEIGHT: 450,
        MAX_OBJECTS: 100,
        GAME_DURATION: 1000 * 300,

        ENTITY_TYPES: {
            CIRCLE: 1 << 1,
            BOX: 1 << 2
        }
    }
})();