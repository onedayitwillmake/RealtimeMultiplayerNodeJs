(function () {
    RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.Input");
    /**
     * A helper class to detect the current state of the controls of the game.
     */
    RealtimeMultiplayerGame.Input.Keyboard = function () {
        this.keys = {'tab': false, 'shift': false, 'space': false, 'up': false, 'down': false, 'left': false, "right": false }
    };

    RealtimeMultiplayerGame.Input.Keyboard.prototype = {
        keyCodes: { '16': 'shift', '32': 'space', '37': 'left', '38': 'up', '39': 'right', '40': 'down', '9': 'tab'},
        keyPressed: 0,

        dealloc: function () {
            // TODO: remove keyup/keydown events
        },

        keyDown: function (e) {
            if (e.keyCode in this.keyCodes) {
                // if we're already pressing down on the same key, then we don't want to increment
                // our key pressed count
                if (!this.keys[ this.keyCodes[ e.keyCode ] ]) {
                    this.keyPressed++;
                }

                this.handler(e.keyCode, true);
                e.preventDefault();
            }
        },
        keyUp: function (e) {
            if (e.keyCode in this.keyCodes) {
                this.handler(e.keyCode, false);
                this.keyPressed--;
                e.preventDefault();
            }
        },

        /**
         * Attach events to the HTML element
         * We don't care about a time clock here, we attach events, we only want
         * to know if something's happened.
         */
        attachEvents: function () {
            var that = this;
            document.addEventListener('keydown', function (e) {
                that.keyDown(e);
            }, false);
            document.addEventListener('keyup', function (e) {
                that.keyUp(e);
            }, false);
        },

        isKeyPressed: function () {
            return this.keyPressed > 0;
        },

        /**
         * Map it to something useful so we know what it is
         */
        handler: function (keyCode, enabled) {
            this.keys[ this.keyCodes[ keyCode] ] = enabled;
        },

        /**
         * Constructs a bitmask based on current keyboard state
         * @return A bitfield containing input states
         */
        constructInputBitmask: function () {
            var input = 0;

            // Check each key
            if (this.keys['up']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.UP;
            if (this.keys['down']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.DOWN;
            if (this.keys['left']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.LEFT;
            if (this.keys['right']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.RIGHT;
            if (this.keys['space']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SPACE;
            if (this.keys['shift']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SHIFT;
            if (this.keys['tab']) input |= RealtimeMultiplayerGame.Constants.INPUT_BITMASK.TAB;

            return input;
        },


        /**
         * Sets the 'key down' properties based on an input mask
         * @param inputBitmask    A bitfield containing input flags
         */
        deconstructInputBitmask: function (inputBitmask) {
            this.keys['up'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.UP);
            this.keys['down'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.DOWN);
            this.keys['left'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.LEFT);
            this.keys['right'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.RIGHT);
            this.keys['space'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SPACE);
            this.keys['shift'] = (inputBitmask & RealtimeMultiplayerGame.Constants.INPUT_BITMASK.SHIFT);
        },

        /**
         * Accessors
         */
        // Some helper methods to find out if we're going in a specific direction
        isLeft: function () {
            return this.keys['left'];
        },
        isUp: function () {
            return this.keys['up'];
        },
        isRight: function () {
            return this.keys['right'];
        },
        isDown: function () {
            return this.keys['down'];
        },
        isSpace: function () {
            return this.keys['space'];
        },
        isShift: function () {
            return this.keys['shift'];
        },
        isTab: function () {
            return this.keys['tab'];
        }
    };
})();