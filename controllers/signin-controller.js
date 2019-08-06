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
  if (!req.session.signin) {
    req.session.signin = {};
  }
  req.session.signin.service = req.query.service;
  req.session.signin.gotoUrl = req.query.goto;
  res.redirect(res.locals.relativePath + "/dwpauth/signin/process");
};

exports.gotoSuccessUrl = (req, res, next) => {
  res.redirect(req.session.signin.gotoUrl);
};

exports.process = async (req, res, next) => {
  try {
    const response = await axios.request({
      url: getAuthenticationUrl(req),
      method: "post",
      headers: {
        "Accept-API-Version": "protocol=1.0,resource=2.1"
      }
    });
    processPayload(req, res, response.data);
  } catch (e) {
    console.log(e);
  }
};

exports.processPost = async (req, res, next) => {
  const { payload } = req.session.signin;
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
  req.session.signin.payload = payload;

  if (payload.tokenId) {
    res.cookie("iPlanetDirectoryPro", payload.tokenId, {
      // domain: process.env.COOKIE_DOMAIN,
      expires: 0,
      httpOnly: true
    });
    res.redirect(res.locals.relativePath + "/dwpauth/signin/success");
    return;
  }

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
    req.session.signin.service
  }&authIndexType=service&authIndexValue=${req.session.signin.service}`;
}
