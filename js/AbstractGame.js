(function(){
	RealtimeMultiplayerGame.AbstractGame = function() {
		return this;
	};

	RealtimeMultiplayerGame.AbstractGame.prototype = {
		// Properties
		gameClockReal   : 0,								// Actual time via "new Date().getTime();"
		gameClock		: 0,								// Seconds since start
		gameTick		: 0,								// Ticks since start

		// Methods
		tick: function() {
			// Store previous time and update current
			var oldTime = this.gameClockReal;
			this.gameClockReal = new Date().getTime();

			// Our clock is zero based, so if for example it says 10,000 - that means the game started 10 seconds ago
			var delta = now - oldTime;
			this.gameClock += delta;
			this.gameTick++;

			// Framerate Independent Motion -
			// 1.0 means running at exactly the correct speed, 0.5 means half-framerate. (otherwise faster machines which can update themselves more accurately will have an advantage)
			var speedFactor = delta / ( this.targetDelta );
			if (speedFactor <= 0) speedFactor = 1;
		}

		// Accessors
	}
})();