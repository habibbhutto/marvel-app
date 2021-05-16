const { marvelService } = require('../services');
const logger = require('../utils/logger');

class CharacterController {
  async getAllCharacters(req, res) {
    const context = {
      fileName: __filename,
      operationName: 'CharacterController.getAllCharacters',
    };

    try {
      logger.info('request received', context);
      const characters = await marvelService.getCharacters();
      res.json(characters);
      res.end();
      logger.info('response sent', context);
    } catch (error) {
      logger.error(error, context);
      res.status(500).json({ message: error.message }).end();
    }
  }
}

module.exports = new CharacterController();
