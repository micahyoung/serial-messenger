describe("SerialMessenger.background", function() {
  var ns;
  beforeEach(function() {
    ns = SerialMessenger.background;
    ns.serialPort = "";
    ns.connectionId = -1;
    ns.readData = "";
  });

  describe("connect", function() {
    var callbackSpy;
    var openSerialSpy;
    var serialPortStorage;
    var chromeSerialPorts;

    beforeEach(function() {
      callbackSpy = jasmine.createSpy("callback spy");
      openSerialSpy = spyOn(ns, "openSerial").andCallThrough();

      var getSerialPortFake = function(message, cb) { cb(serialPortStorage); };
      spyOn(chrome.storage.local, "get").andCallFake(getSerialPortFake);

      var getPortsFake = function(cb) { cb(chromeSerialPorts); };
      spyOn(chrome.serial, "getPorts").andCallFake(getPortsFake);
    });

    describe("when there is a serial port matching the saved port", function() {
      beforeEach(function() {
        serialPortStorage = {serialPort: "my/dev"};
        chromeSerialPorts = ["my/dev"];
      });

      it("calls through to the callback", function() {
        ns.connect(callbackSpy);
        expect(callbackSpy).toHaveBeenCalled();
        expect(openSerialSpy).toHaveBeenCalledWith(callbackSpy);
        expect(openSerialSpy.callCount).toEqual(1);
      });

      describe("when it is called twice", function() {
        it("calls through twice but reuses the open connection", function() {
          ns.connect(callbackSpy);
          ns.connect(callbackSpy);
          expect(callbackSpy.callCount).toEqual(2);
          expect(openSerialSpy.callCount).toEqual(1);
        });
      });
    });

    describe("when there is a serial port but no saved port", function() {
      beforeEach(function() {
        chromeSerialPorts = ["my/dev"];
        serialPortStorage = {serialPort: ""};
      });

      it("calls openSerial with callback", function() {
        ns.connect(callbackSpy);
        expect(openSerialSpy).toHaveBeenCalledWith(callbackSpy);
        expect(callbackSpy).not.toHaveBeenCalled();
      });
    });

    describe("when there is a saved port but no serial port", function() {
      beforeEach(function() {
        chromeSerialPorts = [];
        serialPortStorage = {serialPort: "my/dev"};
      });

      it("calls openSerial with callback", function() {
        ns.connect(callbackSpy);
        expect(openSerialSpy).toHaveBeenCalledWith(callbackSpy);
        expect(callbackSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("readSerial", function() {
    var callbackSpy;
    beforeEach(function() {
      callbackSpy = jasmine.createSpy("callback spy");
    });

    describe("when connect succeeds", function() {
      beforeEach(function() {
        spyOn(ns, "connect").andCallFake(function(cb){ cb(); });
      });

      it("calls through to the callback", function() {
        ns.readSerial(callbackSpy);
        expect(callbackSpy).toHaveBeenCalled();
      });
    });

    describe("when connect fails", function() {
      beforeEach(function() {
        spyOn(ns, "connect").andCallFake(function(cb){ return; });
      });

      it("does not call through to the callback", function() {
        ns.readSerial(callbackSpy);
        expect(callbackSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("writeSerial", function() {
    var callbackSpy;
    beforeEach(function() {
      callbackSpy = jasmine.createSpy("callback spy");
    });

    describe("when connect succeeds", function() {
      beforeEach(function() {
        spyOn(ns, "connect").andCallFake(function(cb){ cb(); });
      });

      it("calls through to the callback", function() {
        ns.writeSerial("message", callbackSpy);
        expect(callbackSpy).toHaveBeenCalled();
      });
    });

    describe("when connect fails", function() {
      beforeEach(function() {
        spyOn(ns, "connect").andCallFake(function(cb){ return; });
      });

      it("does not call through to the callback", function() {
        ns.writeSerial("message", callbackSpy);
        expect(callbackSpy).not.toHaveBeenCalled();
      });
    });
  });
});
