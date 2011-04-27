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

	DemoApp.PlayerEntity = function( anEntityid, aClientid) {
		DemoApp.PlayerEntity.superclass.constructor.call(this, anEntityid, aClientid );
		return this;
	};

	DemoApp.PlayerEntity.prototype = {
		radius					:	100,
		collisionCircle			:	null, // An instance of RealtimeMultiplayerGame.modules.circlecollision.PackedCircle
		entityType: DemoApp.Constants.ENTITY_TYPES.PLAYER_ENTITY,
		input: null,

		updateView: function() {
			if(!this.view) return;
			this.view.x = this.position.x;
			this.view.y = this.position.y;
		},

		setInput: function( input ) {
			this.input = input;
		},

		/**
		 * Deallocate memory
		 */
		dealloc: function() {
			this.collisionCircle.dealloc();
			this.collisionCircle = null;
			DemoApp.CircleEntity.superclass.dealloc.call(this);
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
	RealtimeMultiplayerGame.extend(DemoApp.PlayerEntity, RealtimeMultiplayerGame.model.GameEntity, null);
})();