var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* GET profile page. */
router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'User profile' });
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
/* GET duplicate Gateway account page. */
router.get('/duplicate-gateway-account', function(req, res, next) {
    res.render('duplicate-gateway-account', { title: 'Duplicate Government Gateway account' });
});
/* GET scan QR code page. */
router.get('/google-authenticator', function(req, res, next) {
    res.render('google-authenticator', { title: 'Scan QR code' });
});
/* GET enter Google Authenticator code. */
router.get('/google-authenticator-code', function(req, res, next) {
    res.render('google-authenticator-code', { title: 'Enter verification code' });
});
/* GET to do list. */
router.get('/todolist', function(req, res, next) {
    res.render('todolist', { title: 'To do list' });
});
/* GET to do list. */
router.get('/eligibility', function(req, res, next) {
    res.render('eligibility', { title: 'Confirm eligibility' });
});
module.exports = router;
