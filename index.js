var bb8 = require("./bb8");
var twitch = require("./twitch")
var scan = require("./scan")

scan.addOnPeripheral(function (peripheral) {
  console.log("having peripheral "+peripheral.address);
  bb8.startBB8(peripheral);
});

scan.connect()
twitch.connect()
