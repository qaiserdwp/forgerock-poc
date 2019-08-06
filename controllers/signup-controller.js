const session = require("express-session");
const axios = require("axios");
const _ = require("lodash");
const pageTemplateConfig = require("../auth/page-template-mappings");
const {
  renderCallbacks,
  extractRedirect,
  extractTemplateId
} = require("../auth/callbacks");
const nunjucks = require("nunjucks");

exports.start = (req, res, next) => {
  if (!req.session.signup) {
    req.session.signup = {};
  }
  req.session.signup.service = req.query.service;
  const gotoUrl = new URL(req.query.goto);
  req.session.signup.username = gotoUrl.searchParams.get("username");
  req.session.signup.firstname = gotoUrl.searchParams.get("firstname");
  req.session.signup.lastname = gotoUrl.searchParams.get("lastname");
  res.redirect("/dwpauth/signup/process");
  //res.send(req.session.signup.service);
};

exports.process = async (req, res, next) => {
  try {
    const response = await axios.request({
      url: getAuthenticationUrl(req),
      method: "post",
      headers: {
        "Accept-API-Version": "protocol=1.0,resource=2.1",
        "x-username": req.session.signup.username,
        "x-firstname": req.session.signup.firstname,
        "x-lastname": req.session.signup.lastname
      }
    });
    processPayload(req, res, response.data);
  } catch (e) {
    console.log(e);
  }
  //res.send("Processing");
};

exports.processPost = async (req, res, next) => {
  const { payload } = req.session.signup;
  const postData = req.body;
  let skipped = 0;
  if (postData.callbacks) {
    payload.callbacks.forEach((value, i) => {
      if (payload.callbacks[i].type !== "MetadataCallback") {
        payload.callbacks[i].input[0].value = postData.callbacks[i - skipped];
      } else {
        skipped++;
      }
    });
    // postData.callbacks.forEach((value, i) => {
    //   if (payload.callbacks[i].input) {
    //     payload.callbacks[i].input[0].value = value;
    //   }
    // });
  }
  _.remove(payload.callbacks, e => e.type === "MetadataCallback");

  try {
    console.log("requesting next payload");
    const response = await axios.request({
      url: getAuthenticationUrl(req),
      method: "post",
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "Accept-API-Version": "protocol=1.0,resource=2.1"
      }
    });

    processPayload(req, res, response.data);
  } catch (err) {
    if (err.response) {
      res.json(err.response.data);
    } else {
      res.type("text").send(err.stack);
    }
  }
};

function processPayload(req, res, payload) {
  req.session.signup.payload = payload;

  const redirect = extractRedirect(payload.callbacks);
  if (redirect) {
    res.redirect(redirect.url);
    return;
  }

  const pageTemplate = extractTemplateId(payload.callbacks);
  res.render(pageTemplate, {
    callbacks: renderCallbacks(nunjucks.render, payload.callbacks)
  });
}

function getAuthenticationUrl(req) {
  return `https://dwp.frdpcloud.com/openam/json/realms/root/authenticate?service=${
    req.session.signup.service
  }&authIndexType=service&authIndexValue=${
    req.session.signup.service
  }&username=foo`;
}
