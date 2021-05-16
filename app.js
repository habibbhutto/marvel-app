const express = require('express');
const { marvelService } = require('./services');
const app = express();

app.get('/characters', async (req, res) => {
  try {
    const characters = await marvelService.getCharacters();
    res.json(characters);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message }).end();
  }
});

app.get('/live', (req, res) => {
  res.json({ status: 'Ok' });
  res.end();
});

module.exports = app;
