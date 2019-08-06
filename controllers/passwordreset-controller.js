const session = require("express-session");
const axios = require("axios");
const _ = require("lodash");

const {
  renderCallbacks,
  extractRedirect,
  extractTemplateId
} = require("../auth/callbacks");
const nunjucks = require("nunjucks");

exports.start = (req, res, next) => {
  if (!req.session.pr) {
    req.session.pr = {};
  }
  res.redirect(res.locals.relativePath + "/dwpauth/pr/process");
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
  const { payload } = req.session.pr;
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
  req.session.pr.payload = payload;

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
  return `https://dwp.frdpcloud.com/openam/json/realms/root/authenticate?service=${"DWPAUTHPASSWORDRESET"}&authIndexType=service&authIndexValue=${"DWPAUTHPASSWORDRESET"}`;
}
