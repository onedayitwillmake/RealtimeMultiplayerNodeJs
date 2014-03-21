/**
 File:
 DemoApp.CircleEntity
 Created By:
 Mario Gonzalez
 Project:
 DemoApp
 Abstract:
 This is the base entity for the demo game
 Basic Usage:

 Version:
 1.0
 */
(function () {

    DemoApp.PlayerEntity = function (anEntityid, aClientid) {
        DemoApp.PlayerEntity.superclass.constructor.call(this, anEntityid, aClientid);

        return this;
    };

    DemoApp.PlayerEntity.prototype = {
        entityType: DemoApp.Constants.ENTITY_TYPES.PLAYER_ENTITY,
        input: null,
        radius: 40,

        updateView: function () {
            DemoApp.PlayerEntity.superclass.updateView.call(this);
        },

        setInput: function (input) {
            this.input = input;
        },

        updatePosition: function () {
            var moveSpeed = 1.5;
            // Horizontal accelertheation
            if (this.input.isLeft()) this.acceleration.x -= moveSpeed;
            if (this.input.isRight()) this.acceleration.x += moveSpeed;

            // Vertical movement
            if (this.input.isUp()) this.acceleration.y -= moveSpeed;
            if (this.input.isDown()) this.acceleration.y += moveSpeed;

            this.velocity.translatePoint(this.acceleration);
            this.velocity.limit(5);
            this.velocity.multiply(0.85);
            this.acceleration.set(0, 0);
            this.collisionCircle.position.translatePoint(this.velocity);
            this.position = this.collisionCircle.position.clone();
        },

        setCollisionCircle: function (aCollisionCircle) {
            DemoApp.PlayerEntity.superclass.setCollisionCircle.call(this, aCollisionCircle);
            //	this.collisionCircle.setIsFixed( true );
        },

        /**
         * Deallocate memory
         */
        dealloc: function () {
            if (this.input) {
                this.input.dealloc();
                delete this.input;
            }
            DemoApp.CircleEntity.superclass.dealloc.call(this);
        }
    };

    // extend RealtimeMultiplayerGame.model.GameEntity
    RealtimeMultiplayerGame.extend(DemoApp.PlayerEntity, DemoApp.CircleEntity, null);
})();