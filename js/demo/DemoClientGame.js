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
		},

		netChannelDidConnect: function (messageData)
		{
			DemoApp.DemoClientGame.superclass.netChannelDidConnect( messageData );
			this.joinGame("Player" + this.netChannel.getClientid() ); // Automatically join the game with some name
		}
	}

	// extend RealtimeMultiplayerGame.AbstractClientGame
	RealtimeMultiplayerGame.extend(DemoApp.DemoClientGame, RealtimeMultiplayerGame.AbstractClientGame, null);
})()