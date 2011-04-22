(function() {

	// Let's self contain our demo within a CAATHelloWorld object
	var CAATHelloWorld = function() {
		return this;
	}

	CAATHelloWorld.prototype.create = function()
	{
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

	}

	/**
	 * Stats
	 * Create stats module, and attach to top left
	 */
	CAATHelloWorld.prototype.initStats = function()
	{
		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		// Update
		setInterval( function () {
			stats.update();
		}, 1000 / 30 );

		// Add to <div>
		document.getElementById('header-container').appendChild(stats.domElement);
	}


	// Callback for when browse is ready
	var onDocumentReady = function() {

		var ge = new RealtimeMultiplayerGame.GameEntity();
		console.log( ge.radius );
		// Create an instance of CAATHelloWorld
		var helloWorldInstance = new CAATHelloWorld();
		helloWorldInstance.create();

		var socket = new io.Socket(null, {port: 8080, transports:["websocket"], rememberTransport: false});
		socket.connect();
		socket.on('connect', function(){
			message({ message: ['System', 'Connected']});
		});

		socket.on('message', function(obj){
		 message({ message: ['System', 'message']});
		});

		socket.on('disconnect', function(){
		 message({ message: ['System', 'Disconnected']})
		});
		helloWorldInstance.initStats();

		var joystickTest = new Joystick();
		joystickTest.attachEvents();
	}

	var message = function(obj){
        var el = document.createElement('p');
        if ('announcement' in obj) el.innerHTML = '<em>' + esc(obj.announcement) + '</em>';
        else if ('message' in obj) el.innerHTML = '<b>' + esc(obj.message[0]) + ':</b> ' + esc(obj.message[1]);

		// Log if possible
        if( obj.message && window.console && console.log ) console.log(obj.message[0], obj.message[1]);

        document.getElementsByTagName('aside')[0].appendChild(el);
        document.getElementsByTagName('aside')[0].scrollTop = 1000000;
	};

	var esc = function (msg){
        return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
     };


	// Listen for ready
	window.addEventListener('load', onDocumentReady, false);
})();
