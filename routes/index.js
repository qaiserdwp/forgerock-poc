var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/401', function(req, res, next) {
    res.render('401', { title: 'Express' });
});
router.get('/signout', function(req, res, next) {
    // CALL FR SIGNOUT API
    // TO DO
    res.redirect('https://www.ete.access.service.gov.uk/signout?post_logout_redirect_uri=http://localhost:3000/scp/callback&id_token_hint=');
});
module.exports = router;
