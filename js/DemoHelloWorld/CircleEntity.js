/**
 File:
 DemoHelloWorld.CircleEntity
 Created By:
 Mario Gonzalez
 Project:
 DemoHelloWorld
 Abstract:
 This is the most basic entity i could come up with for a HelloWorldDemo of RealtimeMultiplayerNodeJS
 Basic Usage:
 // Create the GameEntity
 var circleEntity = new DemoHelloWorld.CircleEntity( anEntityid, aClientid );
 circleEntity.entityType = DemoHelloWorld.Constants.ENTITY_TYPES.GENERIC_CIRCLE;
 circleEntity.radius = aRadius;
 circleEntity.position.set( Math.random() * DemoHelloWorld.Constants.GAME_WIDTH, Math.random() * DemoHelloWorld.Constants.GAME_HEIGHT);

 // Place the circle and collision circle into corresponding containers
 this.fieldController.addEntity( circleEntity );
 Version:
 1.0
 */
(function () {
    DemoHelloWorld.CircleEntity = function (anEntityid, aClientid) {
        DemoHelloWorld.CircleEntity.superclass.constructor.call(this, anEntityid, aClientid);
        this.speed = Math.random();
        return this;
    };

    DemoHelloWorld.CircleEntity.prototype = {
        speed: 0,
        radius: DemoHelloWorld.Constants.ENTITY_DEFAULT_RADIUS,
        entityType: DemoHelloWorld.Constants.ENTITY_TYPES.CIRCLE,

        /**
         * Update the entity's view - this is only called on the clientside
         */
        updateView: function () {
            if (!this.view) return;
            this.view.x = this.position.x - this.radius;
            this.view.y = this.position.y - this.radius;
        },

        /**
         * @inheritDoc
         */
        updatePosition: function (speedFactor, gameClock, gameTick) {
            // This is where you would move your entity here
            // Speedfactor is a number between 0.0 and 2.0, where 1.0 means its running at perfect framerate

        },

        /**
         * Deallocate memory
         */
        dealloc: function () {
            DemoHelloWorld.CircleEntity.superclass.dealloc.call(this);
        },

        /**
         * Append radius to our entity description created by the super class
         */
        constructEntityDescription: function () {
            // Note: "~~" is just a way to round the value without the Math.round function call
            return DemoHelloWorld.CircleEntity.superclass.constructEntityDescription.call(this) + ',' + ~~this.radius;
        }
    };

    // extend RealtimeMultiplayerGame.model.GameEntity
    RealtimeMultiplayerGame.extend(DemoHelloWorld.CircleEntity, RealtimeMultiplayerGame.model.GameEntity, null);
})();