describe("SerialMessenger.background", function() {
  var ns;
  beforeEach(function() {
    ns = SerialMessenger.background;
  });

  describe("readSerial", function() {
    it("calls through to the callback", function() {
      var callback = jasmine.createSpy();
      ns.readSerial(callback);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe("writeSerial", function() {
    it("calls through to the callback", function() {
      var callback = jasmine.createSpy();
      ns.writeSerial("message", callback);
      expect(callback).toHaveBeenCalled();
    });
  });
});
