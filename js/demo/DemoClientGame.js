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
			aCircleView.setFillStyle( CAAT.Color.prototype.hsvToRgb( (entityDesc.entityid * 15) % 360, 40, 99).toHex() ); // Random color
			aCircleView.setLocation(entityDesc.x, entityDesc.y); // Place in the center of the screen, use the director's width/height

			var newEntity = null;

			var isOwnedByMe = entityDesc.clientid === this.netChannel.clientid;

			// is this a player entity that is mine, if so i should attach the keyboard to it
			if( entityDesc.entityType & DemoApp.Constants.ENTITY_TYPES.PLAYER_ENTITY ) {
				newEntity = new DemoApp.PlayerEntity( entityDesc.entityid, entityDesc.clientid );
				console.log('got my player, adding keyboard');
				if( isOwnedByMe ) {
					console.log("adding trait to this keyboard's user");
					newEntity.addTraitAndExecute( new RealtimeMultiplayerGame.controller.traits.KeyboardInputTrait() );
					this.clientCharacter = newEntity;
				} 
			} else {
				newEntity = new DemoApp.CircleEntity( entityDesc.entityid, entityDesc.clientid );
			}

			newEntity.position.set( entityDesc.x, entityDesc.y );
			newEntity.setView( aCircleView );
			
			this.fieldController.addEntity( newEntity );
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