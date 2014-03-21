/**
 File:
 AbstractGameView.js
 Created By:
 Mario Gonzalez
 Project:
 RealtimeMultiplayerNodeJS
 Abstract:
 This class contains an interface for a GameView within RealtimeMultiplayerNodeJS
 Basic Usage:
 [This class only contains an interface]
 Your specific game's implementation of a GameView should implement at least these methods.
 */
(function () {
    RealtimeMultiplayerGame.AbstractGameView = function () {
    };

    RealtimeMultiplayerGame.AbstractGameView.prototype = {
        setup: function () {
        },
        update: function (gameClockReal) {
        },
        addEntity: function (anEntityView) {
        },
        removeEntity: function (anEntityView) {
        },
        dealloc: function () {
        }
    };
})();