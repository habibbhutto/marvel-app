const marvelClient = require('./clients/marvel.client');
const cache = require('../utils/cache');
const testData = require('./clients/test-data.json');
const marvelService = require('./character.service');

jest.mock('./clients/marvel.client');
jest.mock('../utils/cache');

describe('MarvelService', () => {
  describe('getCharacter()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    it('retrieves characters from Marvel API when cache is empty', async () => {
      /* arrange */
      cache.get = jest.fn(() => null);
      cache.set = jest.fn();
      marvelClient.getAllCharacters = jest.fn(() => testData.data.results);

      /* act */
      const characters = await marvelService.getCharacters();

      /* assert */
      expect(characters).toContain(1011334);
      expect(characters.length).toBe(100);
      expect(cache.set).toHaveBeenCalled();
    });

    it('retrieves from cache on subsequent calls', async () => {
      /* arrange */
      cache.get = jest.fn(() => testData.data.results.map((e) => e.id));
      cache.set = jest.fn();
      marvelClient.getAllCharacters = jest.fn();

      /* act */
      const characters = await marvelService.getCharacters();

      /* assert */
      expect(characters).toContain(1011334);
      expect(characters.length).toBe(100);
      expect(marvelClient.getAllCharacters).not.toHaveBeenCalled();
      expect(cache.set).not.toHaveBeenCalled();
    });
    it('throws 500 when receives error', async () => {
      /* arrange */
      cache.get = jest.fn(() => null);
      marvelClient.getAllCharacters = jest.fn(() => Promise.reject('dummy error'));

      /* act */
      let actualError;
      try {
        await marvelService.getCharacters();
      } catch (error) {
        actualError = error;
      }

      /* assert */
      expect(actualError.message).toBe('Internal server error');
    });
  });
});
