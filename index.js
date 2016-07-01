var BB8 = require("./bb8");
var twitch = require("./twitch");
var scan = require("./scan");
var cluster = require("cluster");



if (cluster.isMaster) {
  //init fork
  cluster.fork({forked : 0});

  cluster.on("exit", function(worker, code, signal) {
    //next forks
    cluster.fork({forked : 1 });
  });
}

if (cluster.isWorker) {
  //check wether we will manage more than 3 failure
  var forked = process.env && process.env.forked ? process.env.forked : 1;
  var count_error = 0;

  function checkError() {
    if(count_error > 3 || process.env.forked == 0) {
      console.log("closing");
      process.exit(1);
    }
  }

  scan.addOnPeripheral(function(peripheral) {
    console.log("having peripheral", peripheral.address);
    var bb8 = new BB8();

    bb8.on("connecting",function() {
      console.log("connecting");
    })

    bb8.on("connected", function() {
      console.log("connected");

      twitch.connect();
    });

    bb8.on("error", function() {
      console.log("error");
      scan.connect();

      count_error++;
      checkError();
    });

    bb8.on("timeout", function() {
      console.log("timeout");
      scan.connect();

      count_error++;
      checkError();
    });

    bb8.startBB8(peripheral);
  });

  scan.connect();
}
