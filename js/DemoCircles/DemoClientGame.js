/**
 File:
 DemoServerGame
 Created By:
 Mario Gonzalez
 Project:
 DemoApp
 Abstract:
 This is a concrete server instance of our game
 Basic Usage:
 DemoServerGame = new DemoApp.DemoServerGame();
 DemoServerGame.start();
 DemoServerGame.explodeEveryone();
 Version:
 1.0
 */
(function () {

    DemoApp.DemoClientGame = function () {
        DemoApp.DemoClientGame.superclass.constructor.call(this);

        this.startGameClock();
        return this;
    };

    DemoApp.DemoClientGame.prototype = {
        setupView: function () {
            this.view = new DemoApp.DemoView();
            this.view.insertIntoHTMLElementWithId("gamecontainer");

            DemoApp.DemoClientGame.superclass.setupView.call(this);
        },

        /**
         * @inheritDoc
         */
        tick: function () {
            DemoApp.DemoClientGame.superclass.tick.call(this);
            this.view.stats.update();
            this.view.update(this.gameClockReal);
        },

        /**
         * @inheritDoc
         */
        createEntityFromDesc: function (entityDesc) {

            var diameter = entityDesc.radius * 2;

            // Create a view via CAAT
            var aCircleView = new CAAT.ShapeActor();
            aCircleView.create();
            aCircleView.setSize(diameter, diameter);
            aCircleView.setFillStyle("#" + CAAT.Color.prototype.hsvToRgb((entityDesc.entityid * 15) % 360, 40, 99).toHex()); // Random color
            aCircleView.setLocation(entityDesc.x, entityDesc.y); // Place in the center of the screen, use the director's width/height

            var newEntity = null;

            var isOwnedByMe = entityDesc.clientid == this.netChannel.clientid;
            // If this is a player entity
            if (entityDesc.entityType & DemoApp.Constants.ENTITY_TYPES.PLAYER_ENTITY) {
                newEntity = new DemoApp.PlayerEntity(entityDesc.entityid, entityDesc.clientid);

                // If it is a player entity and it's my player entity - attach a KeyboardInputTrait to it
                if (isOwnedByMe) {
                    newEntity.addTraitAndExecute(new RealtimeMultiplayerGame.controller.traits.KeyboardInputTrait());
                    this.clientCharacter = newEntity;
                }
            } else {
                newEntity = new DemoApp.CircleEntity(entityDesc.entityid, entityDesc.clientid);
            }

            newEntity.position.set(entityDesc.x, entityDesc.y);
            newEntity.setView(aCircleView);

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
            entityDescription.entityid = entityDescAsArray[0];
            entityDescription.clientid = entityDescAsArray[1];
            entityDescription.entityType = +entityDescAsArray[2];
            entityDescription.x = +entityDescAsArray[3];
            entityDescription.y = +entityDescAsArray[4];
            entityDescription.radius = +entityDescAsArray[5];
            entityDescription.color = entityDescAsArray[6];
            return entityDescription;
        },

        /**
         * @inheritDoc
         */
        netChannelDidConnect: function (messageData) {
            DemoApp.DemoClientGame.superclass.netChannelDidConnect.call(this, messageData);
            DemoApp.DemoClientGame.prototype.log("DemoClientGame: Joining Game");
            this.joinGame("Player" + this.netChannel.getClientid()); // Automatically join the game with some name
        },

        /**
         * @inheritDoc
         */
        netChannelDidDisconnect: function (messageData) {
            DemoApp.DemoClientGame.superclass.netChannelDidDisconnect.call(this, messageData);
            DemoApp.DemoClientGame.prototype.log("DemoClientGame: netChannelDidDisconnect"); // Display disconnect
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
    }

    // extend RealtimeMultiplayerGame.AbstractClientGame
    RealtimeMultiplayerGame.extend(DemoApp.DemoClientGame, RealtimeMultiplayerGame.AbstractClientGame, null);
})()