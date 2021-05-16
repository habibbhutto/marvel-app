const express = require('express');
const { charactersController } = require('../../controllers');

const router = express.Router();

router.get('/characters', charactersController.getAllCharacters);
router.get('/characters/:id', charactersController.getCharacterById);

module.exports = router;
