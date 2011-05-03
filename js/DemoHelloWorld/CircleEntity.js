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
	DemoApp.CircleEntity = function( anEntityid, aClientid) {
		DemoApp.CircleEntity.superclass.constructor.call(this, anEntityid, aClientid );

		this.velocity = new RealtimeMultiplayerGame.model.Point(0,0);
		this.acceleration = new RealtimeMultiplayerGame.model.Point(0,0);
		return this;
	};

	DemoApp.CircleEntity.prototype = {
		radius					:	DemoApp.Constants.ENTITY_DEFAULT_RADIUS,
		entityType				:	DemoApp.Constants.ENTITY_TYPES.CIRCLE,

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
//			this.x += 2;
//			if(this.x < 0) {
//				this.x = DemoApp.Constants.GAME_WIDTH;
//			}
		},

		/**
		 * Deallocate memory
		 */
		dealloc: function() {
			DemoApp.CircleEntity.superclass.dealloc.call(this);
		},

		/**
		 * Append radius to our entity description created by the super class
		 */
		constructEntityDescription: function() {
			return DemoApp.CircleEntity.superclass.constructEntityDescription.call(this) + ',' + this.radius;
		}
	};

	// extend RealtimeMultiplayerGame.model.GameEntity
	RealtimeMultiplayerGame.extend(DemoApp.CircleEntity, RealtimeMultiplayerGame.model.GameEntity, null);
})();