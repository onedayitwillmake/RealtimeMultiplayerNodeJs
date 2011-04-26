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

		/**
		 * @inheritDoc
		 */
		tick: function() {
			DemoApp.DemoClientGame.superclass.tick.call(this);
		},

		createEntityFromDesc: function(entityDesc) {

			// Create a view via CAAT
			var aCircleView = new CAAT.ShapeActor();
			aCircleView.create();
			aCircleView.setSize(60,60);
			aCircleView.setFillStyle( "#" + (Math.floor(Math.random() * 0xFFFFFF)).toString(16) ); // Random color
			aCircleView.setLocation(entityDesc.x, entityDesc.y); // Place in the center of the screen, use the director's width/height

			var circleEntity = new DemoApp.CircleEntity( entityDesc.entityid, entityDesc.clientid );
			circleEntity.position.set( entityDesc.x, entityDesc.y );
			circleEntity.setView( aCircleView );

			this.fieldController.addEntity( circleEntity );
		},

		/**
		 * @inheritDoc
		 */
		netChannelDidConnect: function (messageData) {
			DemoApp.DemoClientGame.superclass.netChannelDidConnect( messageData );
			this.joinGame("Player" + this.netChannel.getClientid() ); // Automatically join the game with some name
		}
	}

	// extend RealtimeMultiplayerGame.AbstractClientGame
	RealtimeMultiplayerGame.extend(DemoApp.DemoClientGame, RealtimeMultiplayerGame.AbstractClientGame, null);
})()