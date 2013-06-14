(function() {
  var chromeStorageSpy = {
    local: {
      get: {}
    }
  };

  var chromeSerialSpy = {
    read: function(connectionId, bytesToRead, cb) { cb({}); },
    write: function(connectionId, buffer, cb) { cb({}); },
    getPorts: function(cb) { cb({}); },
    open: function(port, cb) { cb({}); }
  };

  chrome.storage = chromeStorageSpy;
  chrome.serial = chromeSerialSpy;
})(chrome);
