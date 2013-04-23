(function() {

  var messageCallback = function(request, sender, sendResponse) {
    function read() {
      var data = JSON.stringify("fake data");
      sendResponse({"result":"ok", "data": data});
    }
    function write(data) {
      sendResponse({"result":"ok"});
    }

    switch(request.command) {
      case "read":
        read();
      break;
      case "write":
        write(request.data);
      break;
      default:
        return;
    }
  };

  chrome.runtime.onMessageExternal.addListener(messageCallback);
  chrome.runtime.onMessage.addListener(messageCallback);

  chrome.app.runtime.onLaunched.addListener(function() {
    window.open("options.html", "SerialMessengerOptions");
  });

})();
