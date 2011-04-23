/**
File:
	AbstractClientGame.js
Created By:
	Mario Gonzalez
Project:
	RealtimeMultiplayerNodeJS
Abstract:
	This class is the client side base Game controller
Basic Usage:
 	[This class is not instantiated! - below is an example of using this class by extending it]

 	(function(){
		MyGameClass = function() {
			return this;
 		}

		RealtimeMultiplayerGame.extend(MyGameClass, RealtimeMultiplayerGame.AbstractGame, null);
	};
Version:
	1.0
*/
(function(){
	RealtimeMultiplayerGame.AbstractClientGame = function() {
		RealtimeMultiplayerGame.AbstractClientGame.superclass.constructor.call(this);

		this.view = new RealtimeMultiplayerGame.View.GameView();
		this.fieldController.setupView();

		return this;
	};

	RealtimeMultiplayerGame.AbstractClientGame.prototype = {
		view										: null,							// View
		nickname									: '',							// User 'nickname'


		// Methods
		setupNetChannel: function() {
//			this.netChannel = new RealtimeMultiplayerGame.network.ServerNetChannel();
		},

		renderAtTime: function(t) {
			//
		},

	//	ClientNetChannelDelegate
		/**
		 * ClientNetChannel has connected via socket.io to server for first time
		 * Join the game
		 * @param messageData
		 */
		netChannelDidConnect: function (messageData)
		{
			// Sync time with server
			this.gameClock = messageData.gameClock;
			this.joinGame(nickname);
		},

		/**
		 * Called when the user has entered a name, and wants to join the match
		 * @param aNickname
		 */
		joinGame: function(aNickname)
		{
			this.nickname = aNickname;

			// Create a 'join' message and queue it in ClientNetChannel
			var message = this.netChannel.composeCommand( RealtimeMultiplayerGame.Constants.CMDS.PLAYER_JOINED, { nickname: this.nickname } );
			this.netChannel.addMessageToQueue( true, message );
		},

		/**
		 * Called by NetChannel when it receives a command if it decides not to intercept it.
		 * (for example CMDS.FULL_UPDATE is always intercepted, so it never calls this function, but CMDS.SERVER_MATCH_START is not intercepted so this function triggered)
		 * @param messageData
		 */
		netChannelDidReceiveMessage: function (messageData)
		{
			debugger;
//			this.CMD_TO_FUNCTION[messageData.cmds.cmd].apply(this,[messageData.id, messageData.cmds.data]);
		},

		netChannelDidDisconnect: function (messageData)
		{
			// Tell the view
//			if(this.view && !this.isGameOver) // If the server was never online, then we never had a view to begin with
//				this.view.serverOffline();
		},


	// Memory
		dealloc: function() {
			if(this.view) this.view.dealloc();
			this.view = null;

			RealtimeMultiplayerGame.AbstractClientGame.superclass.dealloc.call(this);
		}
	};


	// Extend RealtimeMultiplayerGame.AbstractGame
	RealtimeMultiplayerGame.extend(RealtimeMultiplayerGame.AbstractClientGame, RealtimeMultiplayerGame.AbstractGame, null);
})()