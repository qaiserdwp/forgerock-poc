const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signup-controller");
const signinController = require("../controllers/signin-controller");
const prController = require("../controllers/passwordreset-controller");

router.get("/", (req, res, next) => {
  if (
    req.query &&
    req.query.service &&
    req.query.service.includes("DWPAUTHSIGNUP")
  ) {
    signupController.start(req, res, next);
  } else if (
    req.query &&
    req.query.service &&
    req.query.service.includes("DWPAUTHSIGNIN")
  ) {
    signinController.start(req, res, next);
  } else {
    res.send("No service found");
  }
});

router.get("/signup/process", signupController.process);
router.post("/signup/process", signupController.processPost);

router.get("/signin/process", signinController.process);
router.post("/signin/process", signinController.processPost);
router.get("/signin/success", signinController.gotoSuccessUrl);

router.get("/pr/process", prController.process);
router.post("/pr/process", prController.processPost);
router.get("/pr/start", prController.start);

module.exports = router;
