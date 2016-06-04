var sphero = require("sphero");

var BB8_MATCH = /BB-*/;

module.exports = {
  isBB8: function(peripheral) {
    return peripheral && peripheral.advertisement
    && BB8_MATCH.test(peripheral.advertisement.localName);
  },

  startBB8: function(peripheral) {
    console.log("attempt -"+peripheral.id+"-");
    var bb8_device = sphero("64fa5da6bb0f40f6ac90543d56d1e596"); // change BLE address accordingly

    bb8_device.connect(function() {
      // roll BB-8 in a random direction, changing direction every second
      setInterval(function() {
        var direction = Math.floor(Math.random() * 360);
        bb8_device.roll(150, direction);
      }, 1000);
    });
  }
};
