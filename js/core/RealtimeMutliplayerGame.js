/**
 File:
 RealtimeMultiplayerGame.js
 Created By:
 Mario Gonzalez
 Project:
 RealtimeMultiplayerNodeJS
 Abstract:
 This is the core module for RealtimeMultiplayerGame contains the namespace, and extend method

 Basic Usage:
 This class is not instantiated
 */
RealtimeMultiplayerGame = (typeof RealtimeMultiplayerGame === 'undefined') ? {} : RealtimeMultiplayerGame;
/**
 * Allows a package to create a namespace within RealtimeMultiplayerGame
 * From Javascript Patterns book
 * @param ns_string
 */
RealtimeMultiplayerGame.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = RealtimeMultiplayerGame,
        i = 0;

    // strip redundant leading global
    if (parts[0] === "RealtimeMultiplayerGame") {
        parts = parts.slice(1);
    }

    var len = parts.length,
        aPackage = null;
    for (i = 0; i < len; i += 1) {
        var singlePart = parts[i];
        // create a property if it doesn't exist
        if (typeof parent[singlePart] === "undefined") {
            parent[singlePart] = {};
        }
        parent = parent[singlePart];

    }
    return parent;
};

/**
 * Allows a simple inheritance model
 * based on http://www.kevs3d.co.uk/dev/canvask3d/scripts/mathlib.js
 */
RealtimeMultiplayerGame.extend = function (subc, superc, overrides) {
    /**
     * @constructor
     */
    var F = function () {
    };
    var i;

    if (overrides) {
        F.prototype = superc.prototype;
        subc.prototype = new F();
        subc.prototype.constructor = subc;
        subc.superclass = superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }
        for (i in overrides) {
            if (overrides.hasOwnProperty(i)) {
                subc.prototype[i] = overrides[i];
            }
        }
    } else {

        subc.prototype.constructor = subc;
        subc.superclass = superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc;
        }
        for (i in superc.prototype) {
            if (false == subc.prototype.hasOwnProperty(i)) {
                subc.prototype[i] = superc.prototype[i];
            }
        }

    }
}
