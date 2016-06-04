var noble = require("noble");
var bb8 = require("./bb8");
var config = require("./config");
var irc = require("tmi.js");

var found_devices = [];

function has(array, peripheral){
  if(!peripheral) return true; //will prevent add
  var filter = array.filter(function(p) { return p.id == peripheral.id });
  return filter.length > 0;
}

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true, function(error){
      if(error) noble.stopScanning();
    });
  }else{
    noble.stopScanning();
  }
});

noble.on('discover', function callback(peripheral){
  if(peripheral && !has(found_devices, peripheral)){
    peripheral.address = peripheral._noble.address;
    found_devices.push(peripheral);

    if(bb8.isBB8(peripheral)){
      noble.stopScanning();
      setTimeout(function(){
        console.log("having peripheral "+peripheral.address);
        bb8.startBB8(peripheral);
      }, 1000);
    }
  }
});

var client = new irc.client(config.tmi_options);

client.connect();


/*var sphero = require("sphero"),
    bb8 = sphero("64fa5da6bb0f40f6ac90543d56d1e596"); // change BLE address accordingly

bb8.connect(function() {
  // roll BB-8 in a random direction, changing direction every second
  setInterval(function() {
    var direction = Math.floor(Math.random() * 360);
    bb8.roll(150, direction);
  }, 1000);
});*/
