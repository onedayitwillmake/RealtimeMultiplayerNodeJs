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
		entityType: DemoApp.Constants.ENTITY_TYPES.PLAYER_ENTITY,
		input: null,
		radius: 50,
		
		updateView: function() {
			DemoApp.PlayerEntity.superclass.updateView.call( this );
		},

		setInput: function( input ) {
			this.input = input;
		},

		updatePosition: function() {
			if( this.input.isUp() ) {
				this.position.y--;
			}

			if( this.input.isDown() ) {
				this.position.y++;
			}

			if( this.input.isLeft() ) {
				this.position.x--;
			}

			if( this.input.isRight() ) {
				this.position.x++;
			}

			// console.log( this.input.isUp() );
		},

		/**
		 * Deallocate memory
		 */
		dealloc: function() {
			this.input.dealloc();
			delete this.input;
			DemoApp.CircleEntity.superclass.dealloc.call(this);
		}
	};

	// extend RealtimeMultiplayerGame.model.GameEntity
	RealtimeMultiplayerGame.extend(DemoApp.PlayerEntity, DemoApp.CircleEntity, null);
})();