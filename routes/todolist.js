var express = require('express');
var router = express.Router();

/* GET to do list page. */
router.get('/', function(req, res, next) {
    res.render('todolist/todolist.njk');
});

module.exports = router;
