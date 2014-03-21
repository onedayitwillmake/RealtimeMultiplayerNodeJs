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
require("../lib/SortedLookupTable.js");
require("../core/RealtimeMutliplayerGame.js");
require("../model/Point.js");
require("../lib/circlecollision/Circle.js");
require("../lib/circlecollision/CircleManager.js");
require("../model/Constants.js");
require("../model/NetChannelMessage.js");
require("../controller/FieldController.js");
require("../core/AbstractGame.js");
require("../network/Client.js");
require("../network/ServerNetChannel.js");
require("../core/AbstractServerGame.js");
require("../model/GameEntity.js");
require("../model/WorldEntityDescription.js");
require("../input/Keyboard.js");


require("./DemoApp.js");
require("./DemoAppConstants.js");
require("./CircleEntity.js");
require("./PlayerEntity.js");
require("./DemoServerGame.js");

var game = new DemoApp.DemoServerGame();
game.startGameClock();
