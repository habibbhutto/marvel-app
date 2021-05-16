const express = require('express');
const { charactersRouter } = require('./routes/v1');
const app = express();

app.use(charactersRouter);

app.get('/live', (req, res) => {
  res.json({ status: 'Ok' });
  res.end();
});

module.exports = app;
