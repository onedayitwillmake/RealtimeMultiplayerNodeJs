/**
File:
	server.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS
Abstract:
	This is the base server module for starting RealtimeMultiplayerGame
Basic Usage:
 	node server.js
Version:
	1.0
*/
require("./core/RealtimeMutliplayerGame.js");
require("./model/Constants.js");
require("./core/AbstractGame.js");
require("./ServerNetChannel.js");
require("./core/AbstractServerGame.js");
require("./GameEntity.js");
require("./demo/DemoApp.js");
require("./demo/DemoServerGame.js");


var game = new DemoApp.DemoServerGame();
//game.startGameClock();
