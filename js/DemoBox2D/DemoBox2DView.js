/**
 File:
 DemoBox2DView.js
 Created By:
 Mario Gonzalez
 Project:
 RealtimeMultiplayerNodeJS
 Abstract:
 This class represents the view object in the Box2D Demo of RealtimeMultiplayerNodeJS
 It uses the CAAT canvas library to draw the entities
 Basic Usage:
 [Inside DemoBox2DClientGame]
 setupView: function() {
		this.view = new DemoBox2D.DemoView();
		this.view.insertIntoHTMLElementWithId( "gamecontainer" );
		DemoBox2D.DemoClientGame.superclass.setupView.call( this );
	}
 Version:
 1.0
 */
(function () {
    DemoBox2D.DemoView = function (aDelegate) {
        this.setDelegate(aDelegate);
        this.setupCAAT();
        this.setupMouseEvents();
        this.setupStats();
    };

    DemoBox2D.DemoView.prototype = {
        // Properties
        caatDirector: null,				// CAAT Director instance
        caatScene: null,				// CAAT Scene instance
        stats: null,				// Stats.js instance
        delegate: null,				// This is the object that will handle some MouseEvents we recieve from CAAT
        // Methods
        setupCAAT: function () {

            // Create a scene, all directors must have at least one scene - this is where all your stuff goes
            this.caatScene = new CAAT.Scene();
            this.caatScene.create();
            this.caatScene.setFillStyle('#000000');

            // Create the director instance, and immediately add the scene once it's created
            this.caatDirector = new CAAT.Director().initialize(DemoBox2D.Constants.GAME_WIDTH, DemoBox2D.Constants.GAME_HEIGHT);
            this.caatDirector.addScene(this.caatScene); //
        },

        /**
         * Setup MouseEvent which we will funnel to the delegate
         * @param delegate
         */
        setupMouseEvents: function (delegate) {
            var that = this;
            this.caatScene.mouseDown = function (mouseEvent) {
                that.delegate.onViewMouseDown(mouseEvent);
            };
        },

        /**
         * Updates our current view, passing along the current actual time (via Date().getTime());
         * @param {Number} gameClockReal The current actual time, according to the game
         */
        update: function (gameClockReal) {
            var delta = gameClockReal - this.caatDirector.timeline;
            this.caatDirector.render(delta);
            this.caatDirector.timeline = gameClockReal;
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

        /**
         * Creats / Adds an entity into canvas via CAAT
         * // TODO: Currently the entity is already created - however technically this is the function that should make it!
         * @param anEntityView
         */
        addEntity: function (anEntityView) {
            this.caatScene.addChild(anEntityView);
            anEntityView.mouseEnabled = false;
        },

        /**
         * Removes an entity via CAAT
         * @param anEntityView
         */
        removeEntity: function (anEntityView) {
            this.caatScene.removeChild(anEntityView);
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

        // Accessors
        /**
         * Checks that an object contains the required methods and sets it as the delegate for this DemoBox2D.DemoView instance
         * @param {DemoBox2D.DemoViewDelegateProtocol} aDelegate A delegate that conforms to DemoBox2D.DemoViewDelegateProtocol
         */
        setDelegate: function (aDelegate) {
            var theInterface = DemoBox2D.DemoViewDelegateProtocol;
            for (var member in theInterface) {
                if ((typeof aDelegate[member] != typeof theInterface[member])) {
                    console.log("object failed to implement interface member " + member);
                    return false;
                }
            }

            // Checks passed
            this.delegate = aDelegate;
        }
    };

    // Override
    RealtimeMultiplayerGame.extend(DemoBox2D.DemoView, RealtimeMultiplayerGame.AbstractGameView, null);


    /**
     * This is the object that will handle some MouseEvents we recieve from CAAT
     * This is strictly specific to our Box2D demo, and is pretty bare but seems symantically correct following the structure RealtimeMultiplayerNodeJS has in place
     */
    DemoBox2D.DemoViewDelegateProtocol = {
        onViewMouseDown: function (mouseEvent) {
        }
    };
})();


