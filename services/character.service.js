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

      logger.info('requesting from Marvel API', context);
      const data = await marvelClient.getAllCharacters();
      const list = data.map((element) => {
        this._storeElementInCache(element);
        return element.id;
      });

      cache.set('characters', list);
      return list;
    } catch (error) {
      logger.log(error, context);
      throw new Error('Internal server error');
    }
  }

  async getCharacterById({ id }) {
    const context = {
      fileName: __filename,
      operationName: 'MarvelService.getCharacterById',
    };

    try {
      if (cache.keys().length > 1 && !cache.has(id)) {
        logger.info('Character with given Id Not found', context);
        return null;
      }

      const character = cache.get(id);

      if (character) {
        logger.info('retrieving single character from cache', context);
        return character;
      }

      logger.info('requesting from Marvel API', context);
      const data = await marvelClient.getAllCharacters();
      const list = data.map((element) => {
        this._storeElementInCache(element);
        return element.id;
      });

      cache.set('characters', list);

      return cache.get(id);
    } catch (error) {
      logger.log(error, context);
      throw new Error('Internal server error');
    }
  }

  _storeElementInCache(element) {
    const { id, name, description } = element;
    cache.set(`${id}`, { id, name, description });
  }
}

module.exports = new MarvelService();
