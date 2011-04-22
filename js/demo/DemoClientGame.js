/**
File:
	DemoServerGame
Created By:
	Mario Gonzalez
Project:
	DemoApp
Abstract:
	This is a concrete server instance of our game
Basic Usage:
 	DemoServerGame = new DemoApp.DemoServerGame();
 	DemoServerGame.start();
 	DemoServerGame.explodeEveryone();
Version:
	1.0
*/
(function(){

	DemoApp.DemoClientGame = function() {
		DemoApp.DemoClientGame.superclass.constructor.call(this);
		return this;
	};

	DemoApp.DemoClientGame.prototype = {
		tick: function() {
			DemoApp.DemoClientGame.superclass.tick.call(this);
		},

		joinGame: function(aNickname)
		{
			this.nickname = "Demo!";
			DemoApp.DemoClientGame.superclass.joinGame.call(this);
		}
	}

	// extend RealtimeMultiplayerGame.AbstractClientGame
	RealtimeMultiplayerGame.extend(DemoApp.DemoClientGame, RealtimeMultiplayerGame.AbstractClientGame, null);
})()