var express = require("express");
var router = express.Router();
const dwpauthRouter = require("./dwpauth");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/dwpauth", dwpauthRouter);

module.exports = router;
