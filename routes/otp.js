var express = require('express');
var router = express.Router();

/* GET enter OTP page. */
router.get('/', function(req, res, next) {
    res.render('otp/otp.njk');
});

module.exports = router;
