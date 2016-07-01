var config = require("./config");
var irc = require("tmi.js");


var client = new irc.client(config.tmi_options);

client.on("roomstate", function(channel, state) {
  console.log("roomstate from", channel, state);
});

client.on("join", function(channel, username, self) {
  console.log("user logged on", channel, username);
});

client.on("resub", function(channel, username, months) {
  console.log("subanniversary from", channel, username, months);
});

client.on("subscription", function(channel, username) {
  console.log("subscription from", channel, username);
});

module.exports = {
  connect: function() {
    client.connect();

    setInterval(function() {
      client.api({
          url: "https://api.twitch.tv/kraken/channels/"+config.channel_name+"/follows"
      }, function(err, res, body) {
          console.log("followers :=", body.follows.length);
      });
    }, 30000);
  }
};
