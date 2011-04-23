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

	RealtimeMultiplayerGame.AbstractServerGame = function() {
		RealtimeMultiplayerGame.AbstractServerGame.superclass.constructor.call(this);
		return this;
	};

	RealtimeMultiplayerGame.AbstractServerGame.prototype = {
		// Methods
		setupNetChannel: function() {
			this.netChannel = new RealtimeMultiplayerGame.network.ServerNetChannel();
		},


		/**
		 * Updates the gameworld
		 * Creates a WorldEntityDescription which it sends to NetChannel
		 */
		tick: function()
		{
			RealtimeMultiplayerGame.AbstractServerGame.superclass.tick.call(this);

			// Create a new world-entity-description,
			var worldEntityDescription = new WorldEntityDescription( this );

			this.netChannel.tick( this.gameClock, worldEntityDescription );


			if( this.gameClock > this.model.gameDuration) {
				this.shouldEndGame();
			}
		}
	}


	// Extend RealtimeMultiplayerGame.AbstractGame
	RealtimeMultiplayerGame.extend(RealtimeMultiplayerGame.AbstractServerGame, RealtimeMultiplayerGame.AbstractGame, null);
})()