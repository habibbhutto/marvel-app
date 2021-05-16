const marvelClient = require('./clients/marvel.client');
const cache = require('../utils/cache');
const testData = require('./clients/test-data.json');
const marvelService = require('./character.service');

jest.mock('./clients/marvel.client');
jest.mock('../utils/cache');
jest.mock('../utils/logger');

describe('MarvelService', () => {
  describe('getCharacters()', () => {
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
      expect(cache.set).toHaveBeenCalledTimes(101);
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

  describe('getCharacterById()', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    it('retrieves characters from Marvel API when cache is empty', async () => {
      /* arrange */
      const dummyCharacter = { id: 'dummyId', name: 'dummyName', description: 'dummy description' };
      cache.get = jest.fn(() => null);
      cache.set = jest.fn();
      marvelClient.getAllCharacters = jest.fn(() => {
        cache.get = jest.fn(() => dummyCharacter);
        return testData.data.results;
      });

      /* act */
      const character = await marvelService.getCharacterById({ id: 'dummyId' });

      /* assert */
      expect(character.id).toContain('dummyId');
      expect(character.name).toBe('dummyName');
      expect(cache.set).toHaveBeenCalledTimes(101);
      expect(cache.get).toHaveBeenCalledTimes(1);
    });

    it('retrieves from cache on subsequent calls', async () => {
      /* arrange */
      const dummyCharacter = { id: 'dummyId', name: 'dummyName', description: 'dummy description' };
      cache.get = jest.fn(() => dummyCharacter);
      cache.set = jest.fn();
      marvelClient.getAllCharacters = jest.fn();

      /* act */
      const character = await marvelService.getCharacterById({ id: 'dummyId' });

      /* assert */
      expect(character.id).toBe('dummyId');
      expect(character.name).toBe('dummyName');
      expect(marvelClient.getAllCharacters).not.toHaveBeenCalled();
      expect(cache.get).toHaveBeenCalledTimes(1);
      expect(cache.set).not.toHaveBeenCalled();
    });
    it('throws 500 when receives error', async () => {
      /* arrange */
      cache.get = jest.fn(() => null);
      marvelClient.getAllCharacters = jest.fn(() => Promise.reject('dummy error'));

      /* act */
      let actualError;
      try {
        await marvelService.getCharacterById({ id: 'dummyId' });
      } catch (error) {
        actualError = error;
      }

      /* assert */
      expect(actualError.message).toBe('Internal server error');
    });
  });
});
