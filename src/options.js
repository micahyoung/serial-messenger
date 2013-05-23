var SerialMessenger = SerialMessenger || {};
SerialMessenger.options = {};

(function(ns){
  ns.init = function() {
    ns.appId = chrome.runtime.id;

    ns.findElements();
    ns.addOptions();
    ns.addBehavior();
  };

  ns.findElements = function() {
    function findEl(id) {
      var el = document.getElementById(id);
      if (!el) throw "ID " + id + " not found";
      return el;
    }

    ns.appIdInput = findEl("app-id");
    ns.portSelect = findEl("port");
    ns.readButton = findEl("read-button");
    ns.writeButton = findEl("write-button");
    ns.writeInput = findEl("write-data");
    ns.logInput = findEl("log-text");
  };

  ns.addOptions = function() {
    ns.appIdInput.value = ns.appId;

    ns.buildPortOptions();
  };

  ns.addBehavior = function() {
    ns.appIdInput.addEventListener("click", ns.appIdInput.select);

    ns.readButton.addEventListener("click", ns.readSend);

    ns.writeButton.addEventListener("click", function(evt) {
      ns.writeSend(evt, ns.writeInput.value);
    });

    ns.portSelect.addEventListener("change", function(evt) {
      chrome.storage.local.set({"serialPort": evt.target.value});
    });
  };

  ns.readSend = function(evt) {
    chrome.runtime.sendMessage(
      ns.appId,
      {command: "read"},
      function(response) {
        ns.logInput.value += "command: read\n" +
                              "response data: " + JSON.stringify(response) + "\n";
      });
  };

  ns.writeSend = function(evt, data) {
    chrome.runtime.sendMessage(
      ns.appId,
      {command: "write", data: data},
      function(response) {
        ns.logInput.value += "command: write\n" +
                              "sent data: " + data + "\n" +
                              "response: " + JSON.stringify(response) + "\n";
      });
  };

  ns.buildPortOptions = function() {
    chrome.serial.getPorts(function(ports) {
      var eligiblePorts = ports.filter(function(port) {
        return !port.match(/[Bb]luetooth/);
      });

      eligiblePorts.forEach(function(port) {
        var portOption = document.createElement('option');
        portOption.value = portOption.innerText = port;

        chrome.storage.local.get("serialPort", function(storage){
          if (port === storage.serialPort) portOption.selected = "selected";
        });

        ns.portSelect.appendChild(portOption);
      });
    });
  };

  ns.init();

})(SerialMessenger.options);
