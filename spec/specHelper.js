var chromeRuntimeSpy = {
  onMessageExternal: {
    addListener: function(){}
  },
  onMessage: {
    addListener: function(){}
  }
};

var chromeAppSpy = {
  runtime: {
    onLaunched: {
      addListener: function(){}
    }
  }
};

var chromeStorageLocalStorageSpy = {serialPort: "my/dev"};
var chromeStorageSpy = {
  local: {
    get: function(message, cb) { cb(chromeStorageLocalStorageSpy); }
  }
};

var chromeSerialReadInfoSpy = {bytesRead: null, data: null};
var chromeSerialWriteInfoSpy = {bytesWritten: null};
var chromeSerialOpenInfoSpy = {connectionId: null};
var chromeSerialPorts = ["my/dev"];
var chromeSerialSpy = {
  read: function(connectionId, bytesToRead, cb) { cb(chromeSerialReadInfoSpy); },
  write: function(connectionId, buffer, cb) { cb(chromeSerialWriteInfoSpy); },
  getPorts: function(cb) { cb(chromeSerialPorts); },
  open: function(port, cb) { cb(chromeSerialOpenInfoSpy); }
};

var chromeRuntimeOrig = chrome.runtime;
var chromeAppOrig = chrome.app;
var chromeStorageOrig = chrome.storage;
var chromeSerialOrig = chrome.serial;
chrome.runtime = chromeRuntimeSpy;
chrome.app = chromeAppSpy;
chrome.storage = chromeStorageSpy;
chrome.serial = chromeSerialSpy;
