var express = require('express');
var router = express.Router();

/* GET enter Google authenticator code page. */
router.get('/', function(req, res, next) {
    res.render('authenticatorcode/authenticatorcode.njk');
});

module.exports = router;
