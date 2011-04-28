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
(function(){

	var nOffset = Math.random() * 2000;
	DemoApp.CircleEntity = function( anEntityid, aClientid) {
		DemoApp.CircleEntity.superclass.constructor.call(this, anEntityid, aClientid );

		this.velocity = new RealtimeMultiplayerGame.model.Point(0,0);
		this.acceleration = new RealtimeMultiplayerGame.model.Point(0,0);
		return this;
	};

	DemoApp.CircleEntity.prototype = {
		radius					:	DemoApp.Constants.ENTITY_DEFAULT_RADIUS,
		velocity				:	RealtimeMultiplayerGame.model.Point.prototype.ZERO,
		acceleration			:	RealtimeMultiplayerGame.model.Point.prototype.ZERO,
		collisionCircle			:	null,										// An instance of RealtimeMultiplayerGame.modules.circlecollision.PackedCircle
		entityType: DemoApp.Constants.ENTITY_TYPES.GENERIC_CIRCLE,

		/**
		 * Update the entity's view - this is only called on the clientside
		 */
		updateView: function() {
			if(!this.view) return;
			this.view.x = this.position.x - this.radius;
			this.view.y = this.position.y - this.radius;
		},

		/**
		 * Update position of this entity - this is only called on the serverside
		 * @param {Number} speedFactor	A number signifying how much faster or slower we are moving than the target framerate
		 * @param {Number} gameClock	Current game time in seconds (zero based)
		 * @param {Number} gameTick		Current game tick (incrimented each frame)
		 */
		updatePosition: function( speedFactor, gameClock, gameTick ) {

			// Modify velocity using perlin noise
			var theta = 0.008;

			var noise = RealtimeMultiplayerGame.model.noise(nOffset+this.position.x*theta, nOffset+this.position.y*theta, gameTick*0.001);
			var angle = noise*12;
			var speed = 0.2;
			this.acceleration.x += Math.cos( angle ) * speed - 0.3;
			this.acceleration.y -= Math.sin( angle ) * speed;


			this.velocity.translatePoint( this.acceleration );
			this.velocity.limit(5);
			this.velocity.multiply(0.9);
			this.acceleration.set(0,0);
			this.collisionCircle.position.translatePoint( this.velocity );
			this.position = this.collisionCircle.position.clone();
		},

		/**
		 * Deallocate memory
		 */
		dealloc: function() {
			this.collisionCircle.dealloc();
			this.collisionCircle = null;
			DemoApp.CircleEntity.superclass.dealloc.call(this);
		},

		constructEntityDescription: function() {
			return DemoApp.CircleEntity.superclass.constructEntityDescription.call(this) + ',' + this.radius;
		},

		///// ACCESSORS
		/**
		 * Set the CollisionCircle for this game entity.
		 * @param aCollisionCircle
		 */
		setCollisionCircle: function( aCollisionCircle ) {
			this.collisionCircle = aCollisionCircle;
			this.collisionCircle.setDelegate( this );
			this.collisionCircle.setPosition( this.position.clone() );
		},
		getCollisionCircle: function() { return this.collisionCircle }
	};

	// extend RealtimeMultiplayerGame.model.GameEntity
	RealtimeMultiplayerGame.extend(DemoApp.CircleEntity, RealtimeMultiplayerGame.model.GameEntity, null);
})();