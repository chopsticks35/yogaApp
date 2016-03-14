var express = require('express');
var router = express.Router();

router.post('/sendmsg', function(req, res) {
  var resp = {};
  var msg = req.body;

  if (!msg || !msg.to) {
    resp.status = "error";
    resp.message = "invalid data";
    res.json(resp);
  }

  var twClient = require('../twilio/message').sendMsg(msg.to, function(error, message) {
    if (error) {
      resp.status = "error";
      resp.message = error;
    } else {
      resp.status = "success";
      resp.message = message.sid;
    }

    res.json(resp);
  });

});

module.exports = router;
