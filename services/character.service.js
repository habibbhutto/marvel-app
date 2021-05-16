const marvelClient = require('./clients/marvel.client');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

class MarvelService {
  async getCharacters() {
    const context = {
      fileName: __filename,
      operationName: 'MarvelService.getCharacters',
    };

    try {
      const characters = cache.get('characters');

      if (characters) {
        logger.info('retrieving from cache', context);
        return characters;
      }

      logger.info('request from Marvel', context);
      const data = await marvelClient.getAllCharacters();
      const list = data.map((element) => element.id);

      logger.info('storing in cache', context);
      cache.set('characters', list);
      return list;
    } catch (error) {
      logger.log(error, context);
      throw new Error('Internal server error');
    }
  }
}

module.exports = new MarvelService();
