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
		cmdMap					: {},					// Map the CMD constants to functions
		nextEntityID			: 0,					// Incremented for everytime a new object is created

		// Methods
		setupNetChannel: function() {
			this.netChannel = new RealtimeMultiplayerGame.network.ServerNetChannel( this );
		},

		/**
		 * Map RealtimeMultiplayerGame.Constants.CMDS to functions
		 * If ServerNetChannel does not contain a function, it will check to see if it is a special function which the delegate wants to catch
		 * If it is set, it will call that CMD on its delegate
		 */
		setupCmdMap: function() {
			this.cmdMap = {};
			// These are left in as an example
//			this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_JOINED] = this.onPlayerJoined;
//			this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_UPDATE] = this.onPlayerUpdate;
//			this.cmdMap[RealtimeMultiplayerGame.Constants.CMDS.PLAYER_DISCONNECT] = this.onPlayerDisconnect;
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
		},

		shouldAddPlayer: function( client, data ) {
			console.log("(AbstractServerGame)::onPlayerJoined");
		},

		shouldUpdatePlayer: function( client, data ) {
			console.log("(AbstractServerGame)::onPlayerUpdate");
		},

		shouldRemovePlayer: function( client, data ) {
			console.log("(AbstractServerGame)::onPlayerDisconnect");
		},


		///// Accessors
		getNextEntityID: function() {
			return ++this.nextEntityID;
		}
	}


	// Extend RealtimeMultiplayerGame.AbstractGame
	RealtimeMultiplayerGame.extend(RealtimeMultiplayerGame.AbstractServerGame, RealtimeMultiplayerGame.AbstractGame, null);
})()