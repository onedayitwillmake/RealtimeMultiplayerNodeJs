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

		this.setupNetChannel();
		return this;
	};

	RealtimeMultiplayerGame.AbstractServerGame.prototype = {
		netChannel: null,


		// Methods
		setupNetChannel: function() {
			this.netChannel = new RealtimeMultiplayerGame.ServerNetChannel();
		}
	}


	// Extend RealtimeMultiplayerGame.AbstractGame
	RealtimeMultiplayerGame.extend(RealtimeMultiplayerGame.AbstractServerGame, RealtimeMultiplayerGame.AbstractGame, null);
})()