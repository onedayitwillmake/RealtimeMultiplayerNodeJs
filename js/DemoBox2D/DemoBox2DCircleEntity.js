/**
File:
	DemoBox2D.CircleEntity
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
(function(){

	var didShow = false;
	var nOffset = Math.random() * 2000;
	DemoBox2D.CircleEntity = function( anEntityid, aClientid) {
		DemoBox2D.CircleEntity.superclass.constructor.call(this, anEntityid, aClientid );
		this.radius = DemoBox2D.Constants.ENTITY_BOX_SIZE * DemoBox2D.Constants.PHYSICS_SCALE;
		return this;
	};

	DemoBox2D.CircleEntity.prototype = {
		b2Body		: null,												// Reference to Box2D body
		radius		: 1,
		entityType	: DemoBox2D.Constants.ENTITY_TYPES.CIRCLE,

		/**
		 * Update the entity's view - this is only called on the clientside
		 */
		updateView: function() {
			if(!this.view) return;
			this.view.x = this.position.x - this.radius;
			this.view.y = this.position.y - this.radius;

			this.view.setRotation( this.rotation * 0.017453292519943295 );
		},

		/**
		 * Update position of this entity - this is only called on the serverside
		 * @param {Number} speedFactor	A number signifying how much faster or slower we are moving than the target framerate
		 * @param {Number} gameClock	Current game time in seconds (zero based)
		 * @param {Number} gameTick		Current game tick (incrimented each frame)
		 */
		updatePosition: function( speedFactor, gameClock, gameTick ) {
			this.position.x = this.b2Body.m_xf.position.x;
			this.position.y = this.b2Body.m_xf.position.y;
			this.rotation = this.b2Body.GetAngle();
		},

		/**
		 * Deallocate memory
		 */
		dealloc: function() {
			DemoBox2D.CircleEntity.superclass.dealloc.call(this);
		},

		constructEntityDescription: function() {
			return DemoBox2D.CircleEntity.superclass.constructEntityDescription.call(this) + ',' + this.radius;
		},

		///// ACCESSORS
		/**
		 * Set the Box2D body that represents this entity
		 * @param aBox2dBody
		 */
		setBox2DBody: function( aBox2dBody ) {
		   this.b2Body = aBox2dBody;
		},
		getBox2DBody: function() { return this.b2Body }
	};

	// extend RealtimeMultiplayerGame.model.GameEntity
	RealtimeMultiplayerGame.extend(DemoBox2D.CircleEntity, RealtimeMultiplayerGame.model.GameEntity, null);
})();