const express = require('express');
const axios = require('axios');
const nunjucks = require('nunjucks');

const {renderCallbacks, extractRedirect} = require('../auth/callbacks');

const router = express.Router();

const authenticateUrl = 'https://dwp.frdpcloud.com/openam/json/realms/root/authenticate?service=ADAM&authIndexType=service&authIndexValue=ADAM';

function processPayload(req, res, payload) {
  console.log('writing payload to session');
  req.session.payload = payload;

  console.log('checking if payload contains token');
  if (payload.tokenId) {
    res.send('Token: ' + payload.tokenId);
    return;
  }

  console.log('checking if payload contains redirect');
  const redirect = extractRedirect(payload.callbacks);
  if (redirect) {
    res.redirect(redirect.url);
    return;
  }

  console.log('rendering callbacks');
  res.render('auth/flow.njk', {
    callbacks: renderCallbacks(nunjucks.render, payload.callbacks),
  });
}

router.get('/auth', async (req, res) => {
  try {
    console.log('requesting initial payload');
    const response = await axios.request({
      url: authenticateUrl,
      method: 'post',
      headers: {
        'Accept-API-Version': 'protocol=1.0,resource=2.1',
      },
    });

    processPayload(req, res, response.data);
  } catch (err) {
    if (err.response) {
      res.json(err.response.data);
    } else {
      res.type('text').send(err.stack);
    }
  }
});

router.post('/auth', async (req, res) => {
  console.log('reading payload from session');
  const {payload} = req.session;

  console.log('merging input(s) into payload');
  const postData = req.body;
  if (postData.callbacks) {
    postData.callbacks.forEach((value, i) => {
      payload.callbacks[i].input[0].value = value;
    });
  }

  try {
    console.log('requesting next payload');
    const response = await axios.request({
      url: authenticateUrl,
      method: 'post',
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'Accept-API-Version': 'protocol=1.0,resource=2.1',
      },
    });

    processPayload(req, res, response.data);
  } catch (err) {
    if (err.response) {
      res.json(err.response.data);
    } else {
      res.type('text').send(err.stack);
    }
  }
});

router.get('/scp/callback', async (req, res) => {
  console.log('checking session contains previous payload');
  if (!req.session || !req.session.payload) {
    res.status(401).send('Invalid session payload');
    return;
  }

  console.log('reading payload from session');
  const {payload} = req.session;

  try {
    const jsonBody = {
      ...req.query,
      authId: payload.authId,
    };

    console.log('requesting callback payload');
    const response = await axios.request({
      url: authenticateUrl,
      method: 'post',
      params: req.query,
      data: jsonBody,
      headers: {
        'Content-Type': 'application/json',
        'Accept-API-Version': 'protocol=1.0,resource=2.1',
      },
    });

    processPayload(req, res, response.data);
  } catch (err) {
    if (err.response) {
      res.json(err.response.data);
    } else {
      res.type('text').send(err.stack);
    }
  }
});

module.exports = router;
