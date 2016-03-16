var client = require('./client');
var logger = require('../logger/log');
var msg = {};

msg.sendMsg = function(to, message, callback) {
  client.sendMessage({
    to: '7065047372',
    from: '+14108496421', // your Twilio number
    body: 'Namaste, from Ti!' // The body of the text message
  }, function(error, message) {
    // Log the response to DiskDB for auditing purposes
    if (error) {
      logger.logMsg({
        "status": "error",
        "error": error
      });
    } else {
      logger.logMsg({
        "status": "success",
        "message": message
      });
    }
    callback
  })
}

module.exports = msg;
