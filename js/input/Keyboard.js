(function(){
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.Input");
	/**
	 * A helper class to detect the current state of the controls of the game.
	 */
	RealtimeMultiplayerGame.Input.Keyboard = function() {
		this.attachEvents();
	};

	RealtimeMultiplayerGame.Input.Keyboard.prototype = (function() {
		var keys = {'tab': false, 'shift': false, 'space': false, 'up': false, 'down': false, 'left': false, "right": false },
			keyCodes = { '16': 'shift', '32': 'space', '37': 'left', '38': 'up', '39': 'right', '40': 'down', '9': 'tab'},
			keyPressed = 0;
		
		function keyDown( e )
		{
			console.log('key down');
			if( e.keyCode in keyCodes ) {
				// if we're already pressing down on the same key, then we don't want to increment
				// our key pressed count
				if( ! keys[ keyCodes[ e.keyCode ] ] ) {
					keyPressed++;
				}

				handler( e.keyCode, true );
				e.preventDefault();
			}
		}

		function keyUp( e )
		{
			console.log('key up');
			if( e.keyCode in keyCodes ) {
				handler( e.keyCode, false );
				keyPressed--;
				e.preventDefault();
			}
		}

		/**
		 * Attach events to the HTML element
		 * We don't care about a time clock here, we attach events, we only want
		 * to know if something's happened.
		 */
		function attachEvents()
		{
			document.addEventListener('keydown', function(e) { keyDown(e); }, false);
			document.addEventListener('keyup', function(e) { keyUp(e); }, false);
		}

		function isKeyPressed() {
			return keyPressed > 0;
		}

		/**
		 * Map it to something useful so we know what it is
		 */
		function handler( keyCode, enabled ) {
			keys[ keyCodes[ keyCode] ] = enabled;
		}

		/**
		 * Constructs a bitmask based on current keyboard state
		 * @return A bitfield containing input states
		 */
		function constructInputBitmask()
		{
			var input = 0;

			// Check each key
			if(keys['up']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.UP;
			if(keys['down']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.DOWN;
			if(keys['left']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.LEFT;
			if(keys['right']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.RIGHT;
			if(keys['space']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SPACE;
			if(keys['shift']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SHIFT;
			if(keys['tab']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.TAB;

			return input;
		}


		/**
		 * Sets the 'key down' properties based on an input mask
		 * @param inputBitmask 	A bitfield containing input flags
		 */
		function deconstructInputBitmask(inputBitmask)
		{
			keys['up'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.UP);
			keys['down'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.DOWN);
			keys['left'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.LEFT);
			keys['right'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.RIGHT);
			keys['space'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SPACE);
			keys['shift'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SHIFT);
		}

		/**
		 * Accessors
		 */
		// Some helper methods to find out if we're going in a specific direction
		function isLeft() { return keys['left'];}
		function isUp() { return keys['up']; }
		function isRight() { return keys['right']; }
		function isDown() { return keys['down']; }
		function isSpace() { return keys['space']; }
		function isShift() { return keys['shift']; }
		function isTab() { return keys['tab']; }

		return {
			isLeft: isLeft,
			isUp: isUp,
			isRight: isRight,
			isDown: isDown,
			isSpace: isSpace,
			isShift: isShift,
			isTab: isTab,

			isKeyPressed: isKeyPressed,
			attachEvents: attachEvents,
			constructInputBitmask: constructInputBitmask,
			deconstructInputBitmask: deconstructInputBitmask
		};
	})();
})();