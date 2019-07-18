var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* GET additional info page. */
router.get('/additional-information', function(req, res, next) {
    res.render('additional-information', { title: 'Additional information' });
});
/* GET select MFA page. */
router.get('/select-mfa', function(req, res, next) {
    res.render('select-mfa', { title: 'Select MFA' });
});
/* GET input OTP page. */
router.get('/enter-otp', function(req, res, next) {
    res.render('enter-otp', { title: 'Enter OTP' });
});
/* GET scan QR code page. */
router.get('/google-authenticator', function(req, res, next) {
    res.render('google-authenticator', { title: 'Scan QR code' });
});
/* GET enter Google Authenticator code. */
router.get('/google-authenticator-code', function(req, res, next) {
    res.render('google-authenticator-code', { title: 'Enter verification code' });
});
module.exports = router;
