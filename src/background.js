var SerialMessenger = SerialMessenger || {};
SerialMessenger.background = {};

(function(ns) {
  ns.connectionId = -1;
  ns.serialPort = "";

  ns.openSerial = function(callback) {
    var serialPort;

    chrome.storage.local.get("serialPort", function(storage){
      if (!storage.serialPort) {
        console.log("No serial port");
        return;
      }

      serialPort = storage.serialPort;

      chrome.serial.getPorts(function(ports) {
        if (ports.indexOf(serialPort) === -1) {
          console.log("Saved serial port does not exist: " + serialPort);
          return;
        }

        chrome.serial.open(serialPort, function(openInfo) {
          ns.connectionId = openInfo.connectionId;
          ns.serialPort = serialPort;

          callback();
        });
      });
    });
  };

  ns.connect = function(callback) {
    if (ns.serialPort && ns.connectionId != -1) {
      callback();
    } else {
      ns.openSerial(callback);
    }
  };

  ns.ab2str = function(buf) {
    var bufView=new Uint8Array(buf);
    var unis=[];
    for (var i=0; i<bufView.length; i++) {
      unis.push(bufView[i]);
    }
    return String.fromCharCode.apply(null, unis);
  };

  ns.str2ab = function(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0; i<str.length; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  ns.readData = "";
  ns.onRead = function(readInfo, callback) {
    var str = "";

    if (readInfo.bytesRead>0) {
      str = ns.ab2str(readInfo.data);
    }

    if (str.length > 0) {
      ns.readData += str;

      chrome.serial.read(ns.connectionId, 1, function(nextReadInfo) {
        ns.onRead(nextReadInfo, callback);
      });
    } else if (str.length === 0) {
      callback(ns.readData);
      ns.readData = "";
    }
  };

  ns.readSerial = function(callback) {
    ns.connect(function() {
      chrome.serial.read(ns.connectionId, 1, function(readInfo){
        ns.onRead(readInfo, callback);
      });
    });
  };

  ns.writeSerial = function(dataStr, callback) {
    ns.connect(function() {
      var buffer = ns.str2ab(dataStr);

      chrome.serial.write(ns.connectionId, buffer, function(writeInfo) {
        var result = (writeInfo.bytesWritten > 0);
        callback(result);
      });
    });
  };

  ns.respondToRead = function(result, sendResponse) {
    if (result.length > 0) {
      var dataText = JSON.stringify(result);
      sendResponse({"result":"ok", "data":dataText});
    } else {
      sendResponse({"result":"error", "message":"no data"});
    }
  };

  ns.respondToWrite = function(result, sendResponse) {
    if (result === true) {
      sendResponse({"result":"ok"});
    } else {
      sendResponse({"result":"error"});
    }
  };

  ns.messageCallback = function(request, sender, sendResponse) {
    var result;

    switch(request.command) {
      case "read":
        ns.readSerial(function(result) {
          ns.respondToRead(result, sendResponse);
        });

        return true;
      break;
      case "write":
        ns.writeSerial(request.data, function(result) {
          ns.respondToWrite(result, sendResponse);
        });

        return true;
      break;
      default:
        sendResponse({"result": "error"});
        return false;
    }

    return false;
  };

  chrome.runtime.onMessageExternal.addListener(ns.messageCallback);
  chrome.runtime.onMessage.addListener(ns.messageCallback);

  chrome.app.runtime.onLaunched.addListener(function() {
    window.open("options.html", "SerialMessengerOptions");
  });

})(SerialMessenger.background);
