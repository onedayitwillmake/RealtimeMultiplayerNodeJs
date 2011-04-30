/**
File:
	DemoServerGame
Created By:
	Mario Gonzalez
Project:
	DemoBox2D
Abstract:
	This is a concrete server instance of our game
Basic Usage:
 	DemoServerGame = new DemoBox2D.DemoServerGame();
 	DemoServerGame.start();
 	DemoServerGame.explodeEveryone();
Version:
	1.0
*/
(function(){

	DemoBox2D.DemoClientGame = function() {
		DemoBox2D.DemoClientGame.superclass.constructor.call(this);

		this.startGameClock();
		return this;
	};

	DemoBox2D.DemoClientGame.prototype = {
		setupView: function() {
			this.view = new DemoBox2D.DemoView();
			this.view.insertIntoHTMLElementWithId( "gamecontainer" );

			DemoBox2D.DemoClientGame.superclass.setupView.call( this );
		},

		/**
		 * @inheritDoc
		 */
		tick: function() {
			DemoBox2D.DemoClientGame.superclass.tick.call(this);
			this.view.stats.update();
			this.view.update( this.gameClockReal );
		},

		/**
		 * @inheritDoc
		 */
		createEntityFromDesc: function(entityDesc) {

			var diameter = entityDesc.radius * 2;
			diameter = DemoBox2D.Constants.ENTITY_BOX_SIZE * DemoBox2D.Constants.PHYSICS_SCALE * 2;
//			console.log(entityDesc.radius);
			// Create a view via CAAT
			var aCircleView = new CAAT.ShapeActor();
			aCircleView.create();
			aCircleView.setShape( CAAT.ShapeActor.prototype.SHAPE_RECTANGLE  );
			aCircleView.setSize( diameter, diameter);
			aCircleView.setFillStyle( CAAT.Color.prototype.hsvToRgb( (entityDesc.entityid * 15) % 360, 40, 99).toHex() ); // Random color
			aCircleView.setLocation(entityDesc.x, entityDesc.y); // Place in the center of the screen, use the director's width/height

			var newEntity = null;

			var isOwnedByMe = entityDesc.clientid === this.netChannel.clientid;

			// is this a player entity that is mine, if so i should attach the keyboard to it
			if( entityDesc.entityType & DemoBox2D.Constants.ENTITY_TYPES.PLAYER_ENTITY ) {
				newEntity = new DemoBox2D.PlayerEntity( entityDesc.entityid, entityDesc.clientid );
				console.log('got my player, adding keyboard');
				if( isOwnedByMe ) {
					console.log("adding trait to this keyboard's user");
					newEntity.addTraitAndExecute( new RealtimeMultiplayerGame.controller.traits.KeyboardInputTrait() );
					this.clientCharacter = newEntity;
				} 
			} else {
				newEntity = new DemoBox2D.CircleEntity( entityDesc.entityid, entityDesc.clientid );
			}

			newEntity.position.set( entityDesc.x, entityDesc.y );
			newEntity.setView( aCircleView );
			
			this.fieldController.addEntity( newEntity );
		},

		/**
		 * @inheritDoc
		 */
		netChannelDidConnect: function (messageData) {
			DemoBox2D.DemoClientGame.superclass.netChannelDidConnect.call(this, messageData );
			DemoBox2D.DemoClientGame.prototype.log("DemoClientGame: Joining Game");
			this.joinGame("Player" + this.netChannel.getClientid() ); // Automatically join the game with some name
		},

		/**
		 * @inheritDoc
		 */
		netChannelDidDisconnect: function (messageData) {
			DemoBox2D.DemoClientGame.superclass.netChannelDidDisconnect.call(this, messageData );
			DemoBox2D.DemoClientGame.prototype.log("DemoClientGame: netChannelDidDisconnect"); // Display disconnect
		},

		/**
		 * This function logs something to the right panel
		 * @param {Object} An object in the form of: { message: ['Client', 'domReady'] }
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
		})()
	}

	// extend RealtimeMultiplayerGame.AbstractClientGame
	RealtimeMultiplayerGame.extend(DemoBox2D.DemoClientGame, RealtimeMultiplayerGame.AbstractClientGame, null);
})()