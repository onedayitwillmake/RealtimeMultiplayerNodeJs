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

		this.startGameClock();
		return this;
	};

	DemoApp.DemoClientGame.prototype = {
		setupView: function() {
			this.view = new DemoApp.DemoView();
			this.view.insertIntoHTMLElementWithId( "gamecontainer" );
			DemoApp.DemoClientGame.superclass.setupView.call( this );
		},

		/**
		 * @inheritDoc
		 */
		tick: function() {
			DemoApp.DemoClientGame.superclass.tick.call(this);
			this.netChannel.addMessageToQueue( false, RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE, { clientid: this.netChannel.getClientid(), input: 256 } );
		},

		createEntityFromDesc: function(entityDesc) {

			var diameter = DemoApp.Constants.ENTITY_DEFAULT_RADIUS * 2;
			// Create a view via CAAT
			var aCircleView = new CAAT.ShapeActor();
			aCircleView.create();
			aCircleView.setSize( diameter, diameter );
			aCircleView.setFillStyle( CAAT.Color.prototype.hsvToRgb( (entityDesc.entityid * 15) % 360, 40, 99).toHex() ); // Random color
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