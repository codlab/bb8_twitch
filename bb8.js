var util = require("util");
var EventEmitter = require("events").EventEmitter;
var sphero = require("sphero");

var instance = undefined;
var connected = false;

function error_callback(data, err){
  if(instance) {
    instance.errorListener(data, err);
  }
}

function BB8(){
  this.peripheral = undefined;
  connected = false;
}

BB8.prototype.roll = function(device) {
  device.roll(50, 0);

  setTimeout(function(){
    device.roll(50, 180);
    setTimeout(function(){
      device.roll(550, 270);
    }, 300);
  }, 300);
}

BB8.prototype.errorListener = function(err, data){
  var peripheral = this.peripheral;
  if(peripheral == undefined) return;

  connnected = false;
  console.log(data);

  this.emit("error", peripheral);
  peripheral.disconnect(function(){
    console.log("disconnected due to error");
  });

  peripheral.removeListener("error", error_callback);
}

BB8.prototype.startBB8 = function(peripheral) {
  instance = this;
  this.peripheral = peripheral;
  connected = false;
  this.emit("connecting");
  var bb8_device = sphero(peripheral.id); // change BLE address accordingly

  bb8_device.on("error", error_callback);

  bb8_device.connect(function() {
    connected = true;

    instance.emit("connected", peripheral);
    setInterval(function() {
      instance.roll(bb8_device);
    }, 2000);
  });

  setTimeout(function(){
    console.log("connected ?", connected);
    if(connected == false){
      instance.emit("timeout", peripheral);
      bb8_device.disconnect(function(){
        console.log("disconnected");
      });
      bb8_device.removeListener("error", error_callback);
    }
  }, 5000);
}

util.inherits(BB8, EventEmitter);

module.exports = BB8;
