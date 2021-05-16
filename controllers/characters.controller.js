const { marvelService } = require('../services');

class CharacterController {
  async getAllCharacters(req, res) {
    try {
      const characters = await marvelService.getCharacters();
      res.json(characters);
      res.end();
    } catch (error) {
      res.status(500).json({ message: error.message }).end();
    }
  }
}

module.exports = new CharacterController();
