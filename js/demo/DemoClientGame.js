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
			//var connectionID = entityDesc.clientid,
			////						isCharacter  = entityDesc.entityType == this.config.ENTITY_MODEL.ENTITY_MAP.CHARACTER,
			//isOwnedByMe = connectionID == this.netChannel.clientid;
			//
			//// Take care of the special things we have to do when adding a character
			//if(isCharacter)
			//{
			//// This character actually belongs to us
			////						var aCharacter = this.shouldAddPlayer( objectID, connectionID, entityDesc, this.fieldController );
			//
			//// If this character is owned by the us, allow it to be controlled by the keyboard
			//if(isOwnedByMe)
			//{
			////							var clientControlledTrait = TraitFactory.createTraitWithName('ClientControlledTrait');
			////							aCharacter.addTraitAndExecute( new clientControlledTrait() );
			////							this.config.CAAT.CLIENT_CHARACTER = this.clientCharacter = aCharacter;
			//}
			//}
			//else // Every other kind of entity - is just a glorified view as far as the client game is concerned
			//{
			////						 this.fieldController.createAndAddEntityFromDescription(entityDesc);
			//}
			//
			//// Place it where it will be
			////					newPosition.set(entityDesc.x, entityDesc.y);
			////					newRotation = entityDesc.rotation || 0;
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