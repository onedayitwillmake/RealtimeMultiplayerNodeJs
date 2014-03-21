/**
 File:
 WorldEntityDescription.js
 Created By:
 Mario Gonzalez
 Project:
 RealtimeMultiplayerNodeJS
 Abstract:
 A WorldEntityDescription is a full description of the current world state.

 AbstractServerGame creates this each 'tick'
 -> NetChannel passes it to each Client
 -> Each client performs 'delta compression' to remove unchanged entities from being sent
 -> If ready, each client sends the customized WorldEntityDescription to it's connection
 Basic Usage:
 // Create a new world-entity-description, could be some room for optimization here but it only happens once per game loop anyway
 var worldEntityDescription = new WorldEntityDescription( this );
 this.netChannel.tick( this.gameClock, worldEntityDescription );
 */
(function () {
    RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.model");

    RealtimeMultiplayerGame.model.WorldEntityDescription = function (aGameInstance, allEntities) {
        this.gameClock = aGameInstance.getGameClock();
        this.gameTick = aGameInstance.getGameTick();
        this.allEntities = allEntities;


        // Ask each entity to create it's EntityDescriptionString
        this.entities = [];


        return this;
    };

    RealtimeMultiplayerGame.model.WorldEntityDescription.prototype = {
        entities: null,
        gameClock: 0,
        gameTick: 0,

        /**
         * Ask each entity to create it's entity description
         * Returns a single snapshot of the worlds current state as a '|' delimited string
         * @return {String} A '|' delmited string of the current world state
         */
        getEntityDescriptionAsString: function () {
            var len = this.allEntities.length;
            var fullDescriptionString = '';

            this.allEntities.forEach(function (key, entity) {
                var entityDescriptionString = entity.constructEntityDescription(this.gameTick);
                fullDescriptionString += "|" + entityDescriptionString;
            }, this);

            return fullDescriptionString;
        }
    }
})();