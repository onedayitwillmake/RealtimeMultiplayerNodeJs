/**
 File:
 DemoBox2DClientGame.js
 Created By:
 Mario Gonzalez
 Project:
 DemoBox2D
 Abstract:
 This is the client/browser side of the DemoBox2D app within RealtimeMultiplayerNodeJS
 Basic Usage:
 var clientGame = new DemoBox2D.DemoClientGame();
 Version:
 1.0
 */
(function () {

    DemoBox2D.DemoClientGame = function () {
        DemoBox2D.DemoClientGame.superclass.constructor.call(this);

        this.startGameClock();
        return this;
    };

    DemoBox2D.DemoClientGame.prototype = {
        setupView: function () {
            this.view = new DemoBox2D.DemoView(this);
            this.view.insertIntoHTMLElementWithId("gamecontainer");
            this.view.delegate = this;
            DemoBox2D.DemoClientGame.superclass.setupView.call(this);
        },

        /**
         * When the user clicks down, we will create a message and pass that to
         * @param aMouseEvent
         */
        onViewMouseDown: function (aMouseEvent) {
            this.netChannel.addMessageToQueue(false, RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE, { x: aMouseEvent.point.x, y: aMouseEvent.point.y });
        },

        /**
         * @inheritDoc
         */
        tick: function () {
            DemoBox2D.DemoClientGame.superclass.tick.call(this);
            this.view.stats.update();
            this.view.update(this.gameClockReal);
        },

        /**
         * @inheritDoc
         */
        createEntityFromDesc: function (entityDesc) {
            var diameter = entityDesc.radius * DemoBox2D.Constants.PHYSICS_SCALE;
            console.log(entityDesc.entityType, DemoBox2D.Constants.ENTITY_TYPES.BOX);

            // Tell CAAT to create a circle or box depending on the info we receive
            var entityType = (entityDesc.entityType === DemoBox2D.Constants.ENTITY_TYPES.BOX) ? CAAT.ShapeActor.prototype.SHAPE_RECTANGLE : CAAT.ShapeActor.prototype.SHAPE_CIRCLE;

            // Create the entity
            var newEntity = new DemoBox2D.Box2DEntity(entityDesc.entityid, entityDesc.clientid);
            newEntity.position.set(entityDesc.x, entityDesc.y);

            // Create a view via CAAT
            var anEntityView = new CAAT.ShapeActor();
            anEntityView.create();
            anEntityView.setShape(entityType);
            anEntityView.setSize(diameter, diameter);
            anEntityView.setFillStyle("#" + CAAT.Color.prototype.hsvToRgb((entityDesc.entityid * 15) % 360, 40, 99).toHex()); // Random color
            anEntityView.setLocation(entityDesc.x, entityDesc.y); // Place in the center of the screen, use the director's width/height

            // Set the view
            newEntity.setView(anEntityView);

            // Add to the fieldcontroller
            this.fieldController.addEntity(newEntity);
        },

        /**
         * Called by the ClientNetChannel, it sends us an array containing tightly packed values and expects us to return a meaningful object
         * It is left up to each game to implement this function because only the game knows what it needs to send.
         * However the 4 example projects in RealtimeMultiplayerNodeJS offer should be used ans examples
         *
         * @param {Array} entityDescAsArray An array of tightly packed values
         * @return {Object} An object which will be returned to you later on tied to a specific entity
         */
        parseEntityDescriptionArray: function (entityDescAsArray) {
            var entityDescription = {};

            // It is left upto each game to implement this function because only the game knows what it needs to send.
            // However the 4 example projects in RealtimeMultiplayerNodeJS offer this an example
            entityDescription.entityid = +entityDescAsArray[0];
            entityDescription.clientid = +entityDescAsArray[1];
            entityDescription.entityType = +entityDescAsArray[2];
            entityDescription.x = +entityDescAsArray[3];
            entityDescription.y = +entityDescAsArray[4];
            entityDescription.radius = +entityDescAsArray[5];
            entityDescription.rotation = +entityDescAsArray[6];

            return entityDescription;
        },

        /**
         * @inheritDoc
         */
        netChannelDidConnect: function (messageData) {
            DemoBox2D.DemoClientGame.superclass.netChannelDidConnect.call(this, messageData);
            DemoBox2D.DemoClientGame.prototype.log("DemoClientGame: Joining Game");
            this.joinGame("Player" + this.netChannel.getClientid()); // Automatically join the game with some name
        },

        /**
         * @inheritDoc
         */
        netChannelDidDisconnect: function (messageData) {
            DemoBox2D.DemoClientGame.superclass.netChannelDidDisconnect.call(this, messageData);
            DemoBox2D.DemoClientGame.prototype.log("DemoClientGame: netChannelDidDisconnect"); // Display disconnect
        },

        /**
         * This function logs something to the right panel
         * @param {Object} An object in the form of: { message: ['Client', 'domReady'] }
         */
        log: (function () {
            var message = function (message) {
                var el = document.createElement('p');
                el.innerHTML = '<b>' + esc(message) + ':</b> ';

                // Log if possible
                console.log(message);
                document.getElementsByTagName('aside')[0].appendChild(el);
                document.getElementsByTagName('aside')[0].scrollTop = 1000000;
            };

            var esc = function (msg) {
                return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            };

            return message;
        })()
    };

    // extend RealtimeMultiplayerGame.AbstractClientGame
    RealtimeMultiplayerGame.extend(DemoBox2D.DemoClientGame, RealtimeMultiplayerGame.AbstractClientGame, null);
})();