(function(){
	RealtimeMultiplayerGame.namespace("RealtimeMultiplayerGame.Controller");

	RealtimeMultiplayerGame.Controller.FieldController = function() {
		this.view = new RealtimeMultiplayerGame.View.FieldView();
	};

	RealtimeMultiplayerGame.Controller.FieldController.prototype = {
		view: null									// View
	};
})();