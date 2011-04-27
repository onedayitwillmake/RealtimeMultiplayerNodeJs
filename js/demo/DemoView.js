/**
File:
	AbstractServerGame.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS
Abstract:
	This class is the base Game controller in RealtimeMultiplayerGame on the server side.
 	It provides things such as dropping players, and contains a ServerNetChannel
Basic Usage:
 	[This class is not instantiated! - below is an example of using this class by extending it]

 	(function(){
		MyGameClass = function() {
			return this;
 		}

		RealtimeMultiplayerGame.extend(MyGameClass, RealtimeMultiplayerGame.AbstractServerGame, null);
	};
Version:
	1.0
*/
(function(){
	DemoApp.DemoView = function() {
		this.setupCAAT();
	};

	DemoApp.DemoView.prototype = {
		// Properties
		caatDirector		: null,				// CAAT Director instance
		caatScene			: null,				// CAAT Scene instance

		// Methods
		setupCAAT: function() {
			this.caatScene = new CAAT.Scene(); // Create a scene, all directors must have at least one scene - this is where all your stuff goes
			this.caatScene.create();	// Notice we call create when creating this, and ShapeActor below. Both are Actors
			this.caatScene.setFillStyle('#000000');

			this.caatDirector = new CAAT.Director().initialize( DemoApp.Constants.GAME_WIDTH, DemoApp.Constants.GAME_HEIGHT ); // Create the director instance
			this.caatDirector.addScene( this.caatScene ); // Immediately add the scene once it's created

			// Start the render loop, with at 60FPS
			this.caatDirector.loop(60);
		},

		addEntity: function( anEntityView ) {
			console.log( "Adding Entity To CAAT", anEntityView );
			this.caatScene.addChild( anEntityView );
		},

		/**
		 * Insert the CAATDirector canvas into an HTMLElement
		 * @param {String} id An HTMLElement id
		 */
		insertIntoHTMLElementWithId: function( id ) {
			document.getElementById(id).appendChild( this.caatDirector.canvas);
		},

		// Memory
		dealloc: function() {
			this.director.destroy();
		}
	};
})();


