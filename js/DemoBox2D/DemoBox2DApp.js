/**
 File:
 DemoBox2DApp.js
 Created By:
 Mario Gonzalez
 Project:
 RealtimeMultiplayerNodeJS
 Abstract:
 This is the core module for the DemoBox2DApp contains the namespace
 This demo shows how to create a game that uses a Box2D javascript implementation (https://github.com/HBehrens/box2d.js)
 Basic Usage:
 This class is not instantiated
 Version:
 1.0
 */
DemoBox2D = (typeof DemoBox2D === 'undefined') ? {} : DemoBox2D;
/**
 * Allows a package to create a namespace within RealtimeMultiplayerGame
 * From Javascript Patterns book
 * @param ns_string
 */
DemoBox2D.namespace = function (ns_string) {
    var parts = ns_string.split('.'),
        parent = DemoBox2D,
        i = 0;

    // strip redundant leading global
    if (parts[0] === "DemoBox2D") {
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