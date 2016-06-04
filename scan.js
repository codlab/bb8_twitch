var noble = require("noble");

var BB8_MATCH = /BB-*/;

var _can_start = false;
var _waiting = false;
var found_devices = [];
var _callback = function(peripheral){
  //nothing here
}



function isBB8(peripheral) {
  return peripheral && peripheral.advertisement
  && BB8_MATCH.test(peripheral.advertisement.localName);
}

function attemptStart() {
  if(_can_start && _waiting){
    noble.startScanning([], true, function(error){
      if(error) noble.stopScanning();
    });
  }
}

function has(array, peripheral){
  if(!peripheral) return true; //will prevent add
  var filter = array.filter(function(p) { return p.id == peripheral.id });
  return filter.length > 0;
}

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    _can_start = true;
    attemptStart();
  }else{
    noble.stopScanning();
  }
});

noble.on('discover', function callback(peripheral){
  if(peripheral && !has(found_devices, peripheral)){
    peripheral.once('connect', function(){});
    peripheral.address = peripheral._noble.address;
    found_devices.push(peripheral);

    if(isBB8(peripheral)){
      noble.stopScanning();
      setTimeout(function (){
        _callback(peripheral);
      },200);
    }
  }
});

module.exports = {
  connect: function() {
    found_devices = [];
    _waiting = true;
    attemptStart();
  },
  addOnPeripheral: function(callback) {
    _callback = callback;
  }
}
