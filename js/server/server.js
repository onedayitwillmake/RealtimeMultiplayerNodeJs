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

var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    sys = require(process.binding('natives').util ? 'util' : 'sys');
var io = require('./lib/Socket.IO-node');

require("../RealtimeMutliplayerGame.js");
require("../Constants.js");
require("../GameEntity.js");
require("../AbstractGame.js");
require("../AbstractServerGame.js");


var game = new RealtimeMultiplayerGame.AbstractServerGame();
game.startGameClock();

//// Create a minimal http server to listen
//var server = http.createServer(function(req, res){});
//server.listen(8080);
//
//// socket.io, I choose you
//// simplest chat application evar
//var io = io.listen(server);
//var buffer = [];
//io.on('connection', function(client){
//	console.log( client.sessionId);
//  client.send({ buffer: buffer });
//  client.broadcast({ announcement: client.sessionId + ' connected' });
//  client.on('message', function(message){
//    var msg = { message: [client.sessionId, message] };
//    buffer.push(msg);
//    if (buffer.length > 15) buffer.shift();
//    client.broadcast(msg);
//  });
//  client.on('disconnect', function(){
//    client.broadcast({ announcement: client.sessionId + ' disconnected' });
//  });
//});
