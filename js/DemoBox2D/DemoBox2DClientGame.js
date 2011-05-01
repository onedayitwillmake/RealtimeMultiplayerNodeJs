/**
File:
	DemoBox2DClientGame.js
Created By:
	Mario Gonzalez
Project:
	DemoBox2D
Abstract:
	This is the client/browser side of the DemoBox2D app within RealtimeMultiplayerNodeJS
Basic Usage:
 	var clientGame = new DemoBox2D.DemoClientGame();
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

			// Create the entity
			var newEntity = new DemoBox2D.CircleEntity( entityDesc.entityid, entityDesc.clientid );
			newEntity.position.set( entityDesc.x, entityDesc.y );

			// Create a view via CAAT
			var aCircleView = new CAAT.ShapeActor();
			aCircleView.create();
			aCircleView.setShape( CAAT.ShapeActor.prototype.SHAPE_RECTANGLE  );
			aCircleView.setSize( diameter, diameter);
			aCircleView.setFillStyle( "#" + CAAT.Color.prototype.hsvToRgb( (entityDesc.entityid * 15) % 360, 40, 99).toHex() ); // Random color
			aCircleView.setLocation(entityDesc.x, entityDesc.y); // Place in the center of the screen, use the director's width/height


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
	};

	// extend RealtimeMultiplayerGame.AbstractClientGame
	RealtimeMultiplayerGame.extend(DemoBox2D.DemoClientGame, RealtimeMultiplayerGame.AbstractClientGame, null);
})();