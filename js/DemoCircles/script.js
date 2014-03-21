(function () {
    WEB_SOCKET_SWF_LOCATION = "ABC"
    // Callback for when browse is ready
    var onDocumentReady = function () {
        var clientGame = new DemoApp.DemoClientGame();
        DemoApp.DemoClientGame.prototype.log("DemoClientGame: Ready...");
    };

    // Listen for ready
    window.addEventListener('load', onDocumentReady, false);
})();
