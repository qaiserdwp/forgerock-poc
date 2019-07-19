const express = require("express");
const axios = require("axios");
const nunjucks = require("nunjucks");

const router = express.Router();

router.get("/authorisation", async (req, res, next) => {
  console.log("About to check for authorisation");
  if (req.session.payload && req.session.payload.tokenId) {
    console.log("User is logged in, about to check for authorisation");
    try {
      const token = req.session.payload.tokenId;
      const response = await axios.request({
        url: "https://dwp.frdpcloud.com/openam/json/policies/?_action=evaluate",
        method: "post",
        headers: {
          "Accept-API-Version": "protocol=1.0,resource=2.1",
          "Contenty-Type": "application/json",
          iPlanetDirectoryPro: token
        },
        data: {
          resources: ["http://localhost:3000/claim"],
          application: "Qaiser",
          realm: "/"
        }
      });
      console.log("Response is: " + response);
      if (response.data[0].actions["GET"]) {
        res.render("authorisation/index", { authorised: true });
      } else {
        res.render("authorisation/index", { authorised: false });
      }
    } catch (err) {
      res.send("Error" + err);
    }
  } else {
    console.log("User is not logged in");
    res.redirect("/auth");
  }
});

module.exports = router;
