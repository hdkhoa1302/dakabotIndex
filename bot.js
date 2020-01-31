const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');

const app = express();
module.exports = app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_URL = process.env.TELEGRAM_BOT_URL;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;

async function greet(chatId, mess) {
  const testLogin = await rp({
    method: 'POST',
    url: `https://cntt.vnpt.vn/rest/auth/1/session`,
    body: {
      username: 'khoahd',
      password: 'S@d5pybr',
    },
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
  });
  const { session } = testLogin;
  const issueList = await rp({
    method: 'GET',
    url: `https://cntt.vnpt.vn/rest/api/2/search?jql=assignee%20in%20(khoahd,%20duyenpnc,%20khoinda)%20and%20duedate%20%3C=endOfDay()%20and%20status%20not%20in%20(Resolved,Closed)`,
    body: {
      jql: 'type=Bug AND status=Closed',
    },
    headers: {
      cookie: `${session.name}=${session.value}`,
      'Content-Type': 'application/json',
    },
    json: true,
  });
  let messSend = '';
  const test = new Array(issueList.issues);
  messSend = `Các issues due trong ngày hôm nay: \n`;
  for (let i = 0; i < test[0].length; i++) {
    messSend += `https://cntt.vnpt.vn/browse/${test[0][i].key} ${
      test[0][i].fields.assignee.name
    }\n`;
  }
  return rp({
    method: 'POST',
    uri: `${TELEGRAM_API_URL}/sendMessage`,
    body: {
      chat_id: chatId,
      text: messSend,
    },
    json: true,
  });
}
app.post(`/bot${TOKEN}`, async (req, res) => {
  const response = await greet(req.body.message.chat.id, req.body.message);
  res.json({
    status: 'ok',
    response,
  });
});

app.get(`/register${TOKEN}`, async (req, res) => {
  const response = await rp({
    method: 'POST',
    uri: `${TELEGRAM_API_URL}/setWebhook`,
    body: {
      url: `${BOT_URL}/bot${TOKEN}`,
    },
    json: true,
  });
  res.json({
    status: 'ok',
    response,
  });
});

app.all('*', (req, res) => {
  res.status(405).send({ error: 'only POST requests are accepted' });
});
