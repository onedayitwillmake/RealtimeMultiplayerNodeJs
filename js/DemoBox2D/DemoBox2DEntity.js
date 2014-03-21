/**
 File:
 DemoBox2D.Box2DEntity
 Created By:
 Mario Gonzalez
 Project:
 DemoBox2D
 Abstract:
 This is the base entity for the demo game
 Basic Usage:

 Version:
 1.0
 */
(function () {
    var DAG2RAD = 0.0174532925;
    var RAD2DEG = 57.2957795;

    DemoBox2D.Box2DEntity = function (anEntityid, aClientid) {
        DemoBox2D.Box2DEntity.superclass.constructor.call(this, anEntityid, aClientid);
    };

    DemoBox2D.Box2DEntity.prototype = {
        b2Body: null,												// Reference to Box2D body
        radius: 1,
        entityType: DemoBox2D.Constants.ENTITY_TYPES.BOX,

        /**
         * @inheritDoc
         */
        updateView: function () {
            if (!this.view) return;
            this.view.x = this.position.x - this.radius;
            this.view.y = this.position.y - this.radius;

            this.view.setRotation(this.lastReceivedEntityDescription.rotation * DAG2RAD);
        },

        /**
         * @inheritDoc
         */
        updatePosition: function (speedFactor, gameClock, gameTick) {
            this.position.x = this.b2Body.m_xf.position.x * DemoBox2D.Constants.PHYSICS_SCALE;
            this.position.y = this.b2Body.m_xf.position.y * DemoBox2D.Constants.PHYSICS_SCALE;
            this.rotation = this.b2Body.GetAngle();
        },

        /**
         * @inheritDoc
         */
        constructEntityDescription: function () {
            // Send the regular entity description, but also send 'radius' and a rounded version 'rotation'
            return DemoBox2D.Box2DEntity.superclass.constructEntityDescription.call(this) + ',' + this.radius + "," + ~~(this.rotation * RAD2DEG);
        },

        /**
         * @inheritDoc
         */
        dealloc: function () {
            if (this.b2Body) {
                // Destroy box2d body -
            }
            DemoBox2D.Box2DEntity.superclass.dealloc.call(this);
        },

        ///// ACCESSORS
        /**
         * Set the Box2D body that represents this entity
         * @param aBox2dBody
         */
        setBox2DBody: function (aBox2dBody) {
            this.b2Body = aBox2dBody;
        },
        getBox2DBody: function () {
            return this.b2Body
        }
    };

    // extend RealtimeMultiplayerGame.model.GameEntity
    RealtimeMultiplayerGame.extend(DemoBox2D.Box2DEntity, RealtimeMultiplayerGame.model.GameEntity, null);
})();