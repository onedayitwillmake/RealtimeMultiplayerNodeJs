(function () {
    WEB_SOCKET_SWF_LOCATION = "js/lib/Socket.IO-node/support/socket.io-client/lib/vendor/web-socket-js/WebSocketMain.swf";

    // Callback for when browse is ready
    var onDocumentReady = function () {
        var clientGame = new DemoBox2D.DemoClientGame();
        DemoBox2D.DemoClientGame.prototype.log("DemoBox2DClient: Ready...");
    };

    // Listen for ready
    window.addEventListener('load', onDocumentReady, false);
})();
