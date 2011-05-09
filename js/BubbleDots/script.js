(function() {
	// Callback for when browse is ready
	var onDocumentReady = function() {
		var clientGame = new BubbleDots.DemoClientGame();
		BubbleDots.DemoClientGame.prototype.log( "DemoClientGame: Ready..." );
	};

	var newHeight = BubbleDots.Constants.GAME_HEIGHT;
	newHeight -= parseFloat( $("aside").css("padding-top") ) * 2;

	$("aside").height( newHeight + "px");

	// Listen for ready
	window.addEventListener('load', onDocumentReady, false);
})();
