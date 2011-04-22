RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.View");

RealtimeMultiplayerGame.View.FieldView = function() {
	// Create the director instance
	var director = new CAAT.Director().initialize(700, 600);
	// Create a scene, all directors must have at least one scene - this is where all your stuff goes
	var scene = new CAAT.Scene();
	scene.create();	// Notice we call create when creating this, and ShapeActor below. Both are Actors
	scene.setFillStyle('#eeeeee');
	director.addScene(scene); // Immediately add the scene once it's created

	// Make one single circle, and set some properties
	var circle = new CAAT.ShapeActor(); // The ShapeActor constructor function does nothing interesting, simply returns 'this'
	circle.create();	// The 'create' must be called after, in order to make the object
	circle.setSize(60,60); // Set the width and hight of the circle
	circle.setFillStyle('#ff00ff');
	circle.setLocation(director.width*0.5, director.height*0.5); // Place in the center of the screen, use the director's width/height

	// Add it to the scene, if this is not done the circle will not be drawn
	scene.addChild(circle);

	// Add the director to the document
	document.getElementById('gamecontainer').appendChild(director.canvas);
	// Start the render loop, with at 60FPS
	director.loop(60);

	// Every tick, the scene will call this function
	var that = this; // Store a reference to a the 'CAATHelloWorld' instnace
	scene.endAnimate = function(director,time)
	{
		// Move the circle 1 pixel randomly up/down/left/right
		circle.x += Math.random() * 2 - 1;
		circle.y += Math.random() * 2 - 1;
	}
};

RealtimeMultiplayerGame.View.FieldView.prototype = {
	
};