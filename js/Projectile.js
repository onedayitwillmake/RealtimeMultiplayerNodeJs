/**
File:
	AbstractServerGame.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS
Abstract:
	This class is the base Game controller in RealtimeMultiplayerGame on the server side.
 	It provides things such as dropping players, and contains a ServerNetChannel
Basic Usage:
 	[This class is not instantiated! - below is an example of using this class by extending it]

 	(function(){
		MyGameClass = function() {
			return this;
 		}

		RealtimeMultiplayerGame.extend(MyGameClass, RealtimeMultiplayerGame.AbstractServerGame, null);
	};
Version:
	1.0
*/
(function(){

	RealtimeMultiplayerGame.Projectile = function() {
		RealtimeMultiplayerGame.Projectile.superclass.constructor.call(this);
		return this;
	};

	RealtimeMultiplayerGame.Projectile.prototype = {

	}


	// Extend GameEntity
	RealtimeMultiplayerGame.extend(RealtimeMultiplayerGame.Projectile, RealtimeMultiplayerGame.GameEntity, null);
})()