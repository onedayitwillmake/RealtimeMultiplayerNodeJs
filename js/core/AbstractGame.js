/**
 File:
 AbstractGame.js
 Created By:
 Mario Gonzalez
 Project:
 RealtimeMultiplayerNodeJS
 Abstract:
 This class is the base Game controller in RealtimeMultiplayerGame it provides things such as, keeping track of the current game clock, starting and stopping the game clock
 Basic Usage:
 [This class is not instantiated! - below is an example of using this class by extending it]

 (function(){
		MyGameClass = function() {
			return this;
 		}

		RealtimeMultiplayerGame.extend(MyGameClass, RealtimeMultiplayerGame.AbstractGame, null);
	};
 */
(function () {
    RealtimeMultiplayerGame.AbstractGame = function () {
        this.setupNetChannel();
        this.setupCmdMap();
        this.fieldController = new RealtimeMultiplayerGame.Controller.FieldController();
        return this;
    };

    RealtimeMultiplayerGame.AbstractGame.prototype = {
        // Properties
        gameClockReal: 0,											// Actual time via "new Date().getTime();"
        gameClock: 0,											// Seconds since start
        gameTick: 0,											// Ticks since start
        isRunning: true,
        speedFactor: 1,											// Used to create Framerate Independent Motion (FRIM) - 1.0 means running at exactly the correct speed, 0.5 means half-framerate. (otherwise faster machines which can update themselves more accurately will have an advantage)
        intervalGameTick: null,											// Setinterval for gametick
        intervalFramerate: 60,											// Try to call our tick function this often, intervalFramerate, is used to determin how often to call settimeout - we can set to lower numbers for slower computers
        intervalTargetDelta: NaN,	// this.targetDelta, milliseconds between frames. Normally it is 16ms or 60FPS. The framerate the game is designed against - used to create framerate independent motion
        gameDuration: Number.MAX_VALUE,								// Gameduration

        netChannel: null,											// ServerNetChannel / ClientNetChannel determined by subclass
        fieldController: null,											// FieldController
        cmdMap: {},

        /**
         * Setup the ClientNetChannel or ServerNetChannel
         */
        setupNetChannel: function () {
        },

        /**
         * setup the command mapping for the events recevied from netchannel
         */
        setupCmdMap: function () {
        },

        // Methods
        tick: function () {
            // Store previous time and update current
            var oldTime = this.gameClockReal;
            this.gameClockReal = new Date().getTime();

            // Our clock is zero based, so if for example it says 10,000 - that means the game started 10 seconds ago
            var delta = this.gameClockReal - oldTime;
            this.gameClock += delta;
            this.gameTick++;

            // Framerate Independent Motion -
            // 1.0 means running at exactly the correct speed, 0.5 means half-framerate. (otherwise faster machines which can update themselves more accurately will have an advantage)
            this.speedFactor = delta / ( this.intervalTargetDelta );
            if (this.speedFactor <= 0) this.speedFactor = 1;

            this.fieldController.tick(this.speedFactor, this.gameClockReal, this.gameTick);
        },


        /**
         * Start/Restart the game tick
         */
        startGameClock: function () {
            var that = this;
            this.gameClockReal = new Date().getTime();
            this.intervalTargetDelta = Math.floor(1000 / this.intervalFramerate);
            this.intervalGameTick = setInterval(function () {
                that.tick()
            }, this.intervalTargetDelta);
        },

        /**
         * Stop the game tick
         */
        stopGameClock: function () {
            clearInterval(RealtimeMultiplayerGame.AbstractGame.prototype.intervalGameTick);
            clearTimeout(RealtimeMultiplayerGame.AbstractGame.prototype.intervalGameTick);
        },

        setGameDuration: function () {
        },

        // Memory
        dealloc: function () {
            if (this.netChannel) this.netChannel.dealloc();
            this.netChannel = null;

            clearInterval(this.intervalGameTick);
        },

        log: function () {
            // OVERRIDE or USE CONSOLE.LOG
        },

        ///// Accessors
        getGameClock: function () {
            return this.gameClock;
        },
        getGameTick: function () {
            return this.gameTick;
        }
    }
})();