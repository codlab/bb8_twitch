var sphero = require("sphero");

var BB8_MATCH = /BB-*/;

module.exports = {
  isBB8: function(peripheral) {
    return peripheral && peripheral.advertisement
    && BB8_MATCH.test(peripheral.advertisement.localName);
  },

  startBB8: function(peripheral) {

  }
};
