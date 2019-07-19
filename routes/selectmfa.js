var express = require('express');
var router = express.Router();

/* GET additional info page. */
router.get('/', function(req, res, next) {
    res.render('selectmfa/selectmfa.njk');
});

module.exports = router;
