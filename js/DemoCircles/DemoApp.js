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
 Version:
 1.0
 */
DemoApp = (typeof DemoApp === 'undefined') ? {} : DemoApp;
/**
 * Allows a package to create a namespace within RealtimeMultiplayerGame
 * From Javascript Patterns book
 * @param ns_string
 */
DemoApp.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = DemoApp,
        i = 0;

    // strip redundant leading global
    if (parts[0] === "DemoApp") {
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