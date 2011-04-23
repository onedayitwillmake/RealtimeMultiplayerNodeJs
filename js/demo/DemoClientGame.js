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

		this.fieldController.getView().insertIntoHTMLElementWithId( "gamecontainer" );

		this.startGameClock();
		return this;
	};

	DemoApp.DemoClientGame.prototype = {
		tick: function() {
			DemoApp.DemoClientGame.superclass.tick.call(this);
			this.netChannel.addMessageToQueue("ABC");
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