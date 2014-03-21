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
(function () {
    BubbleDots.DemoView = function () {
        this.setupCAAT();
        this.setupStats();
    };

    BubbleDots.DemoView.prototype = {
        // Properties
        caatDirector: null,				// CAAT Director instance
        caatScene: null,				// CAAT Scene instance
        caatRoot: null,
        focusCharacter: null,				// The 'camera' will follow this player
        stats: null,				// Stats.js instance
        textfield: null,				// CAAT text

        // Methods
        setupCAAT: function () {
            this.caatScene = new CAAT.Scene(); // Create a scene, all directors must have at least one scene - this is where all your stuff goes
            this.caatScene.create();	// Notice we call create when creating this, and ShapeActor below. Both are Actors
            this.caatScene.setFillStyle('#323232');

            this.caatDirector = new CAAT.Director().initialize(BubbleDots.Constants.GAME_WIDTH, BubbleDots.Constants.GAME_HEIGHT); // Create the director instance
            this.caatDirector.addScene(this.caatScene); // Immediately add the scene once it's created
            this.caatDirector.setImagesCache(BubbleDots.IMAGE_CACHE);


            this.caatRoot = new CAAT.ActorContainer()
                .setBounds(0, 0, this.caatScene.width, this.caatScene.height)
                .create()
                .enableEvents(false);
            this.caatScene.addChild(this.caatRoot);

            this.setupTextfield();
            this.createGround();
        },

        setupTextfield: function () {
            // Create a textfield
            this.textfield = new CAAT.TextActor();
            this.textfield.setFont("12px sans-serif");
            this.textfield.textAlign = "left";
            this.textfield.textBaseline = "top";
            this.textfield.calcTextSize(this.caatDirector);
            this.textfield.setSize(this.textfield.textWidth, this.textfield.textHeight);
            this.textfield.create();
            this.textfield.fillStyle = "#EEEEEE";
            this.textfield.setLocation(10, 10);
            this.caatScene.addChild(this.textfield);
        },

        /**
         * Updates our current view, passing along the current actual time (via Date().getTime());
         * @param {Number} gameClockReal The current actual time, according to the game
         */
        update: function (gameClockReal) {
            var delta = gameClockReal - this.caatDirector.timeline;

            if (this.focusCharacter) {
                this.followFocusCharacter();
            }

            this.caatDirector.render(delta);
            this.caatDirector.timeline = gameClockReal;
        },

        followFocusCharacter: function () {
            var camSpeed = 0.1;
            var targetX = -this.focusCharacter.x + this.caatScene.width / 2 - 100;
            var targetY = -this.focusCharacter.y + this.caatScene.height / 2 + 50;
            this.caatRoot.x -= (this.caatRoot.x - targetX) * camSpeed;
            this.caatRoot.y -= (this.caatRoot.y - targetY) * camSpeed * 2;
        },

        /**
         * Creates a Stats.js instance and adds it to the page
         */
        setupStats: function () {
            var container = document.createElement('div');
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.top = '0px';
            container.appendChild(this.stats.domElement);
            document.body.appendChild(container);
        },

        addEntity: function (anEntityView) {
//			console.log( "Adding Entity To CAAT", anEntityView );
            this.caatRoot.addChild(anEntityView);
        },

        removeEntity: function (anEntityView) {
            console.log("Removing Entity From CAAT", anEntityView);
            this.caatRoot.removeChild(anEntityView);
        },

        /**
         * Create a view for an entity in CAAT using the entity description
         * @param {Object} entityDesc An object containing properties for this entity, sent from the server
         */
        createEntityView: function (entityDesc) {
            // Retrieve the image from caatDirector (stored in the preloading sequence in script.js)
            var imageName = "particle" + entityDesc.color;
            var imageRef = this.caatDirector.getImage(imageName);
            var caatImage = new CAAT.CompoundImage()
                .initialize(imageRef, 1, 1);

            // Create the actor using the image
            var actor = this.CAATSprite = new CAAT.SpriteActor()
                .create()
                .setSpriteImage(caatImage)
                .setLocation(entityDesc.x, entityDesc.y);

            return actor;
        },

        createGround: function () {
            // Retrieve the image from caatDirector (stored in the preloading sequence in script.js)
            var imageRef = this.caatDirector.getImage("ground");
            var caatImage = new CAAT.CompoundImage()
                .initialize(imageRef, 1, 1);

            for (var i = 0; i < 10; ++i) {
                // Create the actor using the image
                var actor = this.CAATSprite = new CAAT.SpriteActor()
                    .create()
                    .setSpriteImage(caatImage)
                    .setLocation(i * caatImage.width, 470);

                this.caatRoot.addChild(actor);
            }

            return actor;
        },

        /**
         * Insert the CAATDirector canvas into an HTMLElement
         * @param {String} id An HTMLElement id
         */
        insertIntoHTMLElementWithId: function (id) {
            document.getElementById(id).appendChild(this.caatDirector.canvas);
        },

        // Memory
        dealloc: function () {
            this.director.destroy();
        },

        setFocusCharacter: function (entity) {
            this.focusCharacter = entity;
        }
    };
})();


