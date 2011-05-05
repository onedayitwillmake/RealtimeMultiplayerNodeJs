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

	BubbleDots.CandyEntity = function( anEntityid, aClientid) {
		BubbleDots.CandyEntity.superclass.constructor.call(this, anEntityid, aClientid );
		this.entityType = BubbleDots.Constants.ENTITY_TYPES.CANDY_ENTITY;
		return this;
	};

	BubbleDots.CandyEntity.prototype = {
		radius: 1,
		
		setCollisionCircle: function( aCollisionCircle ) {
			BubbleDots.CandyEntity.superclass.setCollisionCircle.call( this, aCollisionCircle );
//			aCollisionCircle.setCollisionGroup( 1 );
//			aCollisionCircle.setCollisionMask( 1 );
		}
	};

	// extend RealtimeMultiplayerGame.model.GameEntity
	RealtimeMultiplayerGame.extend(BubbleDots.CandyEntity, BubbleDots.CircleEntity, null);
})();