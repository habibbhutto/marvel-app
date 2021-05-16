const express = require('express');
const { charactersController } = require('../../controllers');

const router = express.Router();

router.get('/characters', charactersController.getAllCharacters);

module.exports = router;
