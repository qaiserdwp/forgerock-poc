var express = require('express');
var router = express.Router();

/* GET enter QR code page. */
router.get('/', function(req, res, next) {
    res.render('qrcode/qrcode.njk');
});

module.exports = router;
