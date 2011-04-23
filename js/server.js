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
require("./lib/SortedLookupTable.js");
require("./core/RealtimeMutliplayerGame.js");
require("./model/Constants.js");
require("./Controller/FieldController.js");
require("./core/AbstractGame.js");
require("./network/Client.js");
require("./network/ServerNetChannel.js");
require("./core/AbstractServerGame.js");
require("./GameEntity.js");
require("./demo/DemoApp.js");
require("./demo/DemoServerGame.js");


var game = new DemoApp.DemoServerGame();
//game.startGameClock();
