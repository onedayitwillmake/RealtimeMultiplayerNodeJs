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

			// Make one single circle, and set some properties
//			var circle = new CAAT.ShapeActor(); // The ShapeActor constructor function does nothing interesting, simply returns 'this'
//			circle.create();	// The 'create' must be called after, in order to make the object
//			circle.setSize(60,60); // Set the width and hight of the circle
//			circle.setFillStyle('#ff00ff');
//			circle.setLocation(director.width*0.5, director.height*0.5); // Place in the center of the screen, use the director's width/height

			// Add it to the scene, if this is not done the circle will not be drawn
//			this.caatScene.addChild(circle);


			// Every tick, the scene will call this function
//			var that = this; // Store a reference to a the 'CAATHelloWorld' instnace
//			scene.endAnimate = function(director,time)
//			{
////				// Move the circle 1 pixel randomly up/down/left/right
////				circle.x += Math.random() * 2 - 1;
////				circle.y += Math.random() * 2 - 1;
//			}
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

		// Accessors
	};
})()


