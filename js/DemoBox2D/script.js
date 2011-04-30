(function() {

	// Callback for when browse is ready
	var onDocumentReady = function() {
		var clientGame = new DemoBox2D.DemoClientGame();
		DemoBox2D.DemoClientGame.prototype.log( "DemoClientGame: Ready..." );
	};

	// Listen for ready
	window.addEventListener('load', onDocumentReady, false);
})();
