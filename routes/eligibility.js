var express = require('express');
var router = express.Router();

/* GET eligibility page. */
router.get('/', function(req, res, next) {
    res.render('eligibility/eligibility.njk');
});

module.exports = router;
