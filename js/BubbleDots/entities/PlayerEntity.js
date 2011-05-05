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

	BubbleDots.PlayerEntity = function( anEntityid, aClientid) {
		BubbleDots.PlayerEntity.superclass.constructor.call(this, anEntityid, aClientid );
		this.entityType = BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY;
		return this;
	};

	BubbleDots.PlayerEntity.prototype = {
		entityType: BubbleDots.Constants.ENTITY_TYPES.PLAYER_ENTITY,
		input: null,
		radius: 30,
		
		updateView: function() {
			BubbleDots.PlayerEntity.superclass.updateView.call( this );
		},

		setInput: function( input ) {
			this.input = input;
		},

		updatePosition: function() {
			var moveSpeed = 1.5;
			// Horizontal accelertheation
			if( this.input.isLeft() ) this.acceleration.x -= moveSpeed;
			if( this.input.isRight() ) this.acceleration.x += moveSpeed;

			// Vertical movement
			if( this.input.isUp() ) this.acceleration.y -= moveSpeed;
			if( this.input.isDown() ) this.acceleration.y += moveSpeed;

			this.velocity.translatePoint( this.acceleration );
			this.velocity.limit(9);
			this.velocity.multiply(0.5);
			this.acceleration.set(0,0);
			this.collisionCircle.position.translatePoint( this.velocity );
			this.position = this.collisionCircle.position.clone();
		},

		setCollisionCircle: function( aCollisionCircle ) {
			BubbleDots.PlayerEntity.superclass.setCollisionCircle.call( this, aCollisionCircle );
//			aCollisionCircle.setCollisionGroup( 1 );
//			aCollisionCircle.setCollisionMask( 1 );
		},

		/**
		 * Deallocate memory
		 */
		dealloc: function() {
			if(this.input) {
				this.input.dealloc();
				delete this.input;
			}
			BubbleDots.CircleEntity.superclass.dealloc.call(this);
		}
	};

	// extend RealtimeMultiplayerGame.model.GameEntity
	RealtimeMultiplayerGame.extend(BubbleDots.PlayerEntity, BubbleDots.CircleEntity, null);
})();