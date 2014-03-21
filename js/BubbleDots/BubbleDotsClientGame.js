/**
 File:
 DemoServerGame
 Created By:
 Mario Gonzalez
 Project:
 BubbleDots
 Abstract:
 This is a concrete server instance of our game
 Basic Usage:
 DemoServerGame = new BubbleDots.DemoServerGame();
 DemoServerGame.start();
 DemoServerGame.explodeEveryone();
 Version:
 1.0
 */
(function () {

    BubbleDots.DemoClientGame = function () {
        BubbleDots.DemoClientGame.superclass.constructor.call(this);

        this.startGameClock();
        return this;
    };

    BubbleDots.DemoClientGame.prototype = {
        setupView: function (images) {
            this.view = new BubbleDots.DemoView(images);
            this.view.insertIntoHTMLElementWithId("gamecontainer");

            BubbleDots.DemoClientGame.superclass.setupView.call(this);
        },

        /**
         * @inheritDoc
         */
        tick: function () {
            BubbleDots.DemoClientGame.superclass.tick.call(this);
            this.view.stats.update();
            this.view.update(this.gameClockReal);
            this.view.textfield.setText("Ping: " + this.netChannel.getLatency());
        },

        /**
         * @inheritDoc
         */
        createEntityFromDesc: function (entityDesc) {

            // Create a new BubbleDots entity
            var newEntity = new BubbleDots.CircleEntity(entityDesc.entityid, entityDesc.clientid);
            newEntity.position.set(entityDesc.x, entityDesc.y);

            var entityView = this.view.createEntityView(entityDesc);
            newEntity.setView(entityView);

            this.fieldController.addEntity(newEntity);

            // Our own character
            if (entityDesc.clientid == this.netChannel.getClientid() && entityDesc.entityType & BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY) {
                this.setupClientPlayer(newEntity);
                this.view.setFocusCharacter(entityView);
            }
        },

        /**
         * Called when the player that represents this user is created
         * @param anEntity
         */
        setupClientPlayer: function (anEntity) {
            anEntity.addTraitAndExecute(new RealtimeMultiplayerGame.controller.traits.KeyboardInputTrait());
            this.clientCharacter = anEntity;
        },

        /**
         * @inheritDoc
         */
        netChannelDidConnect: function (messageData) {
            BubbleDots.DemoClientGame.superclass.netChannelDidConnect.call(this, messageData);
            BubbleDots.DemoClientGame.prototype.log("DemoClientGame: Joining Game");
            this.joinGame("Player" + this.netChannel.getClientid()); // Automatically join the game with some name
        },

        /**
         * @inheritDoc
         */
        netChannelDidDisconnect: function (messageData) {
            BubbleDots.DemoClientGame.superclass.netChannelDidDisconnect.call(this, messageData);
            BubbleDots.DemoClientGame.prototype.log("DemoClientGame: netChannelDidDisconnect"); // Display disconnect
        },

        /**
         * An array containing values received from the entity
         * @param {String} singleWorldUpdate
         */
        parseEntityDescriptionArray: function (entityDescAsArray) {
            var entityDescription = {};
            // It is up to the user to make sure that their objects are following a certain order
            // We do this because we need the performance of sending the tiniest strings possible
            entityDescription.entityid = entityDescAsArray[0];
            entityDescription.clientid = entityDescAsArray[1];
            entityDescription.entityType = +entityDescAsArray[2];
            entityDescription.x = +entityDescAsArray[3];
            entityDescription.y = +entityDescAsArray[4];
            entityDescription.scale = +entityDescAsArray[5];
            entityDescription.color = entityDescAsArray[6];
            return entityDescription;
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
    RealtimeMultiplayerGame.extend(BubbleDots.DemoClientGame, RealtimeMultiplayerGame.AbstractClientGame, null);
})();