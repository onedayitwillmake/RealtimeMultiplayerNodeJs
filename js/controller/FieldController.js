(function () {
    RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.Controller");

    RealtimeMultiplayerGame.Controller.FieldController = function () {
        this.entities = new SortedLookupTable();
        this.players = new SortedLookupTable();
    };

    RealtimeMultiplayerGame.Controller.FieldController.prototype = {
        entities: null,					// A SortedLookupTable for all entities
        players: null,					// A SortedLookupTable for players only, stored using client.getClientid()

        /**
         * Update all entities
         * @param {Number} speedFactor    A number signifying how much faster or slower we are moving than the target framerate
         * @param {Number} gameClock    Current game time in seconds (zero based)
         * @param {Number} gameTick        Current game tick (incrimented each frame)
         */
        tick: function (speedFactor, gameClock, gameTick) {
            // DO SOME STUFF
        },

        /**
         * Internal function. Adds an entity to our collection, and adds it to the view if we have one
         * @param anEntity    An entity to add, should already be created and contain a unique entityid
         */
        addEntity: function (anEntity) {
            this.entities.setObjectForKey(anEntity, anEntity.entityid);

            // If we have a view, then add the player to it
            if (this.view) {
                this.view.addEntity(anEntity.getView());
            }

        },

        /**
         * Updates the entity based on new information (called by AbstractClientGame::renderAtTime)
         * @param {int}        entityid    entityid we want to update
         * @param {RealtimeMultiplayerGame.model.Point}    newPosition    position
         * @param {Number}    newRotation    rotation
         * @param {Object}    newEntityDescription The full contents of the the snapshots newEntityDescription
         */
        updateEntity: function (entityid, newPosition, newRotation, newEntityDescription) {
            var entity = this.entities.objectForKey(entityid);

            if (entity != null) {
                entity.position.x = newPosition.x;
                entity.position.y = newPosition.y;
                entity.rotation = newRotation;
                entity.lastReceivedEntityDescription = newEntityDescription;
            } else {
                console.log("(FieldController)::updateEntity - Error: Cannot find entity with entityid", entityid);
            }
        },

///// Memory

        addPlayer: function (aPlayerEntity) {
            this.addEntity(aPlayerEntity);
            this.players.setObjectForKey(aPlayerEntity, aPlayerEntity.clientid);
        },

        /**
         * Remove a player.
         * Does player stuff, then calls removeEntity.
         * @param clientid    ConnectionID of the player who jumped out of the game
         */
        removePlayer: function (clientid) {
            var player = this.players.objectForKey(clientid);
            if (!player) {
                console.log("(FieldController), No 'Character' with clientid " + clientid + " ignoring...");
                return;
            }

            this.removeEntity(player.entityid);
            this.players.remove(player.clientid);
        },


        /**
         * Removes an entity by it's ID
         * @param entityid
         */
        removeEntity: function (entityid) {
            var entity = this.entities.objectForKey(entityid);

            if (this.view)
                this.view.removeEntity(entity.view);

            entity.dealloc();
            this.entities.remove(entityid);
        },

        /**
         * Checks an array of "active entities", against the existing ones.
         * It's used to remove entities that expired in between two updates
         * @param activeEntities
         */
        removeExpiredEntities: function (activeEntities) {
            var entityKeysArray = this.entities._keys;
            var i = entityKeysArray.length;
            var key;
            var totalRemoved = 0;

            while (i--) {
                key = entityKeysArray[i];

                // This entity is still active. Move along.
                if (activeEntities[key])
                    continue;

                // This entity is not active, check if it belongs to the server
                var entity = this.entities.objectForKey(key);
                var isPlayer = this.players.objectForKey(entity.clientid) != null;


                // Remove special way if player (which calls removeEntity on itself as well), or just remove it as an entity
                if (isPlayer) {
                    this.removePlayer(entity.clientid);
                } else {
                    this.removeEntity(entity.entityid);
                }

                totalRemoved++;
            }

        },

        dealloc: function () {
            this.players.forEach(function (key, entity) {
                this.removePlayer(entity.clientid);
            }, this);
            this.players.dealloc();
            this.players = null;

            this.entities.forEach(function (key, entity) {
                this.removeEntity(entity.entityid);
            }, this);
            this.entities.dealloc();
            this.entities = null;


            this.view = null;
        },

///// Accessors
        // Will be called on client side
        setView: function (aView) {
            var theInterface = RealtimeMultiplayerGame.Controller.FieldControllerViewProtocol;
            for (var member in theInterface) {
                if ((typeof aView[member] != typeof theInterface[member])) {
                    console.log("object failed to implement interface member " + member);
                    return false;
                }
            }

            // Checks passed
            this.view = aView;
        },
        getView: function () {
            return this.view
        },
        getEntities: function () {
            return this.entities
        },
        getPlayers: function () {
            return this.players;
        },
        getEntityWithid: function (anEntityid) {
            return this.entities.objectForKey(anEntityid);
        },
        getPlayerWithid: function (aClientid) {
            return this.players.objectForKey(aClientid);
        }
    };

    /**
     * Required methods for the FieldControllerView delegate
     */
    RealtimeMultiplayerGame.Controller.FieldControllerViewProtocol = {
        addEntity: function (anEntityView) {
        },
        dealloc: function () {
        }
    }
})();