const express = require('express');
const { charactersRouter, docsRouter } = require('./routes/v1');
const app = express();

app.use(charactersRouter);
app.use(docsRouter);

app.get('/live', (req, res) => {
  res.json({ status: 'Ok' });
  res.end();
});

module.exports = app;
