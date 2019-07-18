var express = require('express');
var router = express.Router();

/* GET duplicate Gateway account page. */
router.get('/', function(req, res, next) {
    res.render('duplicate/duplicate-gateway-account.njk');
});

module.exports = router;
