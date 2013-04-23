var SerialMessenger = {};

(function(app){
  app.init = function() {
    app.id = chrome.runtime.id;

    app.findElements();
    app.addBehavior();
  };

  app.findElements = function() {
    function findEl(id) {
      var el = document.getElementById(id);
      if (!el) throw "ID " + id + " not found";
      return el;
    }

    app.appIdInput = findEl("app-id");
    app.readButton = findEl("read-button");
    app.writeButton = findEl("write-button");
    app.writeInput = findEl("write-data");
    app.logInput = findEl("log-text");
  };

  app.addBehavior = function() {
    app.appIdInput.value = app.id;
    app.appIdInput.addEventListener("click", app.appIdInput.select);

    app.readButton.addEventListener("click", app.readSend);

    app.writeButton.addEventListener("click", function(evt) {
      app.writeSend(evt, app.writeInput.value);
    });
  };

  app.readSend = function(evt) {
    chrome.runtime.sendMessage(
      app.id,
      {command: "read"},
      function(response) {
        app.logInput.value += "command: read\n" +
                              "response data: " + JSON.stringify(response) + "\n";
      });
  };

  app.writeSend = function(evt, data) {
    chrome.runtime.sendMessage(
      app.id,
      {command: "write", data: data},
      function(response) {
        app.logInput.value += "command: write\n" +
                              "sent data: " + data + "\n" +
                              "response data: " + JSON.stringify(response) + "\n";
      });
  };

  app.init();

})(SerialMessenger);
