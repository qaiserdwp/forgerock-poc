const express = require('express');
const axios = require('axios');
const nunjucks = require('nunjucks');

const {renderCallbacks, extractRedirect} = require('../auth/callbacks');

const router = express.Router();

const startingPointUrl = 'https://dwp.frdpcloud.com/openam/json/realms/root/authenticate?service=ADAM&authIndexType=service&authIndexValue=ADAM';

function renderAuthPage(req, res, payload) {
  console.log('rendering response');
  res.render('auth/start.njk', {
    callbacks: renderCallbacks(nunjucks.render, payload.callbacks),
  });
}

router.get('/auth', async (req, res) => {
  console.log('requesting initial payload');
  const response = await axios.request({
    url: startingPointUrl,
    method: 'post',
    headers: {
      'Accept-API-Version': 'protocol=1.0,resource=2.1',
    },
  });

  console.log('writing payload to session');
  req.session.payload = response.data;

  renderAuthPage(req, res, response.data);
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

  console.log('sending completed payload');
  const response = await axios.request({
    url: startingPointUrl,
    method: 'post',
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      'Accept-API-Version': 'protocol=1.0,resource=2.1',
    },
  });

  console.log('writing next payload to session');
  req.session.payload = response.data;

  console.log('checking if next payload contains redirect');
  const redirect = extractRedirect(response.data.callbacks);
  if (redirect) {
    res.redirect(redirect.url);
    return;
  }

  renderAuthPage(req, res, response.data)
});

router.get('/scp/callback', async (req, res) => {
  if (!req.session || !req.session.payload) {
    res.status(401).send('Invalid session payload');
    return;
  }

  const {payload} = req.session;
  const response = await axios.request({
    url: startingPointUrl,
    method: 'post',
    data: {
      authId: payload.authId,
    },
    headers: {
      'Content-Type': 'application/json',
      'Accept-API-Version': 'protocol=1.0,resource=2.1',
    },
  });

  console.log('RESPONSE', JSON.stringify(response.data));

  res.send('working');
});

module.exports = router;
