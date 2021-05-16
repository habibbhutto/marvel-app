const marvelClient = require('./clients/marvel.client');
const cache = require('../utils/cache');

class MarvelService {
  async getCharacters() {
    try {
      const characters = cache.get('characters');

      if (characters) {
        console.log('retrieving from cache!');
        return characters;
      }

      const data = await marvelClient.getAllCharacters();
      const list = data.map((element) => element.id);

      console.log('storing in cache!');
      cache.set('characters', list);
      return list;
    } catch (error) {
      console.log(error);
      throw new Error('Internal server error');
    }
  }
}

module.exports = new MarvelService();
