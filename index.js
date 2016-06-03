var noble = require("noble");
var bb8 = require("./bb8");


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
      found_devices = [];
      noble.stopScanning();
      bb8.startBB8(peripheral);
    }
  }
});
