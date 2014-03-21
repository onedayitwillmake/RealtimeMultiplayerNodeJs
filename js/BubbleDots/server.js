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
require("../model/Constants.js");
require("../model/NetChannelMessage.js");
require("../model/GameEntity.js");
require("../model/WorldEntityDescription.js");
require("../network/ServerNetChannel.js");
require("../network/Client.js");
require("../lib/circlecollision/Circle.js");
require("../lib/circlecollision/CircleManager.js");
require("../controller/FieldController.js");
require("../core/AbstractGame.js");
require("../core/AbstractServerGame.js");
require("../input/Keyboard.js");
require("../controller/traits/BaseTrait.js");


//require("v8-profiler");
require("./BubbleDotsApp.js");
require("./BubbleDotsConstants.js");
require("./entities/CircleEntity.js");
require("./entities/PlayerEntity.js");
require("./traits/FoodTrait.js");
require("./traits/PoisonTrait.js");
require("./traits/PerlinNoiseTrait.js");
require("./traits/ChaseTrait.js");
require("./traits/GravityTrait.js");
require("./traits/BoundaryTrait.js");
require("./BubbleDotsServerGame.js");

var game = new BubbleDots.DemoServerGame();
game.startGameClock();
