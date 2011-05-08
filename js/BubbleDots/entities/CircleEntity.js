/**
File:
	BubbleDots.CircleEntity
Created By:
	Mario Gonzalez
Project:
	BubbleDots
Abstract:
	This is the base entity for the demo game
Basic Usage:

Version:
	1.0
*/
(function(){
	BubbleDots.CircleEntity = function( anEntityid, aClientid) {
		BubbleDots.CircleEntity.superclass.constructor.call(this, anEntityid, aClientid );

		this.entityType = BubbleDots.Constants.ENTITY_TYPES.CANDY_ENTITY;
		this.originalColor = null;
		this.velocity = new RealtimeMultiplayerGame.model.Point(0,0);
		this.acceleration = new RealtimeMultiplayerGame.model.Point(0,0);
		return this;
	};

	BubbleDots.CircleEntity.prototype = {
		radius					:	BubbleDots.Constants.ENTITY_DEFAULT_RADIUS,
		velocity				:	RealtimeMultiplayerGame.model.Point.prototype.ZERO,
		acceleration			:	RealtimeMultiplayerGame.model.Point.prototype.ZERO,
		collisionCircle			:	null,										// An instance of RealtimeMultiplayerGame.modules.circlecollision.PackedCircle
		entityType				: 	null,
		color					:	null,
		originalColor			:	null,

		// Movement properties
		velocityMax				:	7.0,
		velocityDamping			:	0.9,


		/**
		 * Update the entity's view - this is only called on the clientside
		 */
		updateView: function() {
			if(!this.view) return;

			this.view.x = this.position.x - this.radius;
			this.view.y = this.position.y - this.radius;

			var diameter = this.lastReceivedEntityDescription.radius * 2;
			this.view.setSize( diameter, diameter );
			this.view.setFillStyle( "#" + this.lastReceivedEntityDescription.color  ); // Random color
		},

		/**
		 * Update position of this entity - this is only called on the serverside
		 * @param {Number} speedFactor	A number signifying how much faster or slower we are moving than the target framerate
		 * @param {Number} gameClock	Current game time in seconds (zero based)
		 * @param {Number} gameTick		Current game tick (incrimented each frame)
		 */
		updatePosition: function( speedFactor, gameClock, gameTick ) {
			this.handleAcceleration();
		},

		handleAcceleration: function() {
			this.velocity.translatePoint( this.acceleration );
			this.velocity.limit(this.velocityMax);
			this.velocity.multiply(this.velocityDamping);

			this.collisionCircle.position.translatePoint( this.velocity );
			this.position = this.collisionCircle.position.clone();

			this.acceleration.set(0,0);
		},

		tempColor: function() {
			var that = this;

			clearTimeout( this.timeout );
			this.color = "FF0000";
			this.timeout = setTimeout(function(){
				that.setColor( that.originalColor );
			}, 50);
		},

		/**
		 * Deallocate memory
		 */
		dealloc: function() {
			this.collisionCircle.dealloc();
			this.collisionCircle = null;
			BubbleDots.CircleEntity.superclass.dealloc.call(this);
		},

		constructEntityDescription: function() {
			var entityDesc = BubbleDots.CircleEntity.superclass.constructEntityDescription.call(this);
			entityDesc += ',' +  ~~(this.radius);
			entityDesc += ',' + this.color;

			return entityDesc;
		},

		///// ACCESSORS
		/**
		 * Set the CollisionCircle for this game entity.
		 * @param aCollisionCircle
		 */
		setCollisionCircle: function( aCollisionCircle ) {
			this.collisionCircle = aCollisionCircle;
			this.collisionCircle.collisionMask = 1;
			this.collisionCircle.collisionGroup = 2;
			this.collisionCircle.setDelegate( this );
			this.collisionCircle.setPosition( this.position.clone() );
 			this.collisionCircle.setRadius( this.radius );

		},
		getCollisionCircle: function() { return this.collisionCircle },

		/**
		 * Set the color of this entity, a property originalColor is also stored
		 * @param aColor
		 */
		setColor: function(aColor) {
			if(!this.originalColor) {
				this.originalColor = aColor;
			}

			this.color = aColor;
		},
		getColor: function(){ return this.color },
		getOriginalColor: function(){ return this.originalColor }
	};

	// extend RealtimeMultiplayerGame.model.GameEntity
	RealtimeMultiplayerGame.extend(BubbleDots.CircleEntity, RealtimeMultiplayerGame.model.GameEntity, null);
})();