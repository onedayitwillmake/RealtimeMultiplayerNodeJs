// Import
var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    sys = require(process.binding('natives').util ? 'util' : 'sys');
var io = require('./lib/Socket.IO-node');
require("../namespace.js");
require("../Constants.js");
require("../GameEntity.js");

var ge = new RealtimeMultiplayerGame.GameEntity();
console.log( RealtimeMultiplayerGame.Constants.ENTITY_DEFAULT_RADIUS );
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
