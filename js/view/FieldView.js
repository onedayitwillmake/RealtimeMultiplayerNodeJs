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
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.View");
	RealtimeMultiplayerGame.View.FieldView = function() {
		this.setupCAAT();
	};

	RealtimeMultiplayerGame.View.FieldView.prototype = {
		// Properties
		caatDirector		: null,				// CAAT Director instance
		caatScene			: null,				// CAAT Scene instance

		// Methods
		setupCAAT: function() {
			this.caatScene = new CAAT.Scene(); // Create a scene, all directors must have at least one scene - this is where all your stuff goes
			this.caatScene.create();	// Notice we call create when creating this, and ShapeActor below. Both are Actors
			this.caatScene.setFillStyle('#000000');


			this.caatDirector = new CAAT.Director().initialize(700, 600); // Create the director instance
			this.caatDirector.addScene( this.caatScene ); // Immediately add the scene once it's created

			// Start the render loop, with at 60FPS
			this.caatDirector.loop(60);
		},

		addEntity: function( anEntityView ) {
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
		},

		// Accessors
		getCaatScene: function() { return this.caatScene; }
	};
})()


