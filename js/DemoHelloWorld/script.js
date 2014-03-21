(function () {
    // Callback for when browse is ready
    var onDocumentReady = function () {
        var clientGame = new DemoHelloWorld.DemoClientGame();
        DemoHelloWorld.DemoClientGame.prototype.log("DemoClientGame: Ready...");
    };

    // Listen for ready
    window.addEventListener('load', onDocumentReady, false);
})();
