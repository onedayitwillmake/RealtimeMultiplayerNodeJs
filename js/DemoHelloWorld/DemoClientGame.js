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
			this.view.stats.update();
			this.view.update( this.gameClockReal );
		},

		/**
		 * @inheritDoc
		 */
		createEntityFromDesc: function(entityDesc) {

			var diameter = entityDesc.radius * 2;

			// Create a view via CAAT
			var aCircleView = new CAAT.ShapeActor();
			aCircleView.create();
			aCircleView.setSize( diameter, diameter );
			aCircleView.setFillStyle( "#" + CAAT.Color.prototype.hsvToRgb( (entityDesc.entityid * 15) % 360, 40, 99).toHex() ); // Random color
			aCircleView.setLocation(entityDesc.x, entityDesc.y); // Place in the center of the screen, use the director's width/height

			// Create the entity and add it to the fieldcontroller
			var newEntity = new DemoApp.CircleEntity( entityDesc.entityid, entityDesc.clientid );
			newEntity.position.set( entityDesc.x, entityDesc.y );
			newEntity.setView( aCircleView );
			
			this.fieldController.addEntity( newEntity );
		},

		/**
		 * @inheritDoc
		 */
		netChannelDidConnect: function (messageData) {
			DemoApp.DemoClientGame.superclass.netChannelDidConnect.call(this, messageData );
			this.joinGame("Player" + this.netChannel.getClientid() ); // Automatically join the game with some name
		},

		/**
		 * @inheritDoc
		 */
		netChannelDidReceiveMessage: function (messageData)
		{
			DemoApp.DemoClientGame.superclass.netChannelDidReceiveMessage.call(this, messageData );
			// Do some stuff here
		},

		/**
		 * @inheritDoc
		 */
		netChannelDidDisconnect: function (messageData) {
			DemoApp.DemoClientGame.superclass.netChannelDidDisconnect.call(this, messageData );
			// Do some stuff here
		},

		/**
		 * @inheritDoc
		 */
		joinGame: function(aNickname)
		{
			// This is called when the user has decided to join the game, in our HelloWorld example this happens automatically
			// In a regular game situation, this might happen after a user picked their chracter for example
			this.nickname = aNickname;
			// Create a 'join' message and queue it in ClientNetChannel
			this.netChannel.addMessageToQueue( true, RealtimeMultiplayerGame.Constants.CMDS.PLAYER_JOINED, { nickname: this.nickname } );
		},

		/**
		 * @inheritDoc
		 */
		log: (function(){
			var message = function(message){
				var el = document.createElement('p');
 				el.innerHTML = '<b>' + esc(message) + ':</b> ';

				// Log if possible
				console.log(message);
				document.getElementsByTagName('aside')[0].appendChild(el);
				document.getElementsByTagName('aside')[0].scrollTop = 1000000;
			};

			var esc = function (msg){
				return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			};

			return message;
		})(),

		/**
		 * Deallocate memory from your game, and let the superclass do the same
		 */
		dealloc: function() {
			DemoApp.DemoClientGame.superclass.dealloc.call( this );
		}
	};

	// extend RealtimeMultiplayerGame.AbstractClientGame
	RealtimeMultiplayerGame.extend(DemoApp.DemoClientGame, RealtimeMultiplayerGame.AbstractClientGame, null);
})()