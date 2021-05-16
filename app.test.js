const supertest = require('supertest');
const testData = require('./services/clients/test-data.json');
const { marvelService } = require('./services');
const app = require('./app');

const request = supertest(app);

jest.mock('./services');
jest.mock('./utils/logger');

describe('app', () => {
  describe('/characters', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('returns list of characters', async () => {
      marvelService.getCharacters = jest.fn(() => testData.data.results.map((e) => e.id));

      const response = await request.get('/characters');

      expect(response.statusCode).toBe(200);
      expect(response.body).not.toBeNull();
      expect(response.body.length).toBeGreaterThan(0);
      expect(marvelService.getCharacters).toHaveBeenCalled();
    });

    it('throws internal server error', async () => {
      marvelService.getCharacters = jest.fn(() => {
        throw new Error('Internal server error');
      });

      const response = await request.get('/characters');

      expect(response.statusCode).toBe(500);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe('Internal server error');
      expect(marvelService.getCharacters).toHaveBeenCalled();
    });
  });

  describe('/characters/:id', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('returns a character', async () => {
      const dummyCharacter = { id: 'dummyId', name: 'dummyName', description: 'dummy description' };
      marvelService.getCharacterById = jest.fn(() => dummyCharacter);

      const response = await request.get('/characters/dummyId');

      expect(response.statusCode).toBe(200);
      expect(response.body).not.toBeNull();
      expect(response.body.id).toBe('dummyId');
      expect(response.body.name).toBe('dummyName');
      expect(marvelService.getCharacterById).toHaveBeenCalled();
    });

    it('throws internal server error', async () => {
      marvelService.getCharacterById = jest.fn(() => {
        throw new Error('Internal server error');
      });

      const response = await request.get('/characters/dummyId');

      expect(response.statusCode).toBe(500);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe('Internal server error');
      expect(marvelService.getCharacterById).toHaveBeenCalled();
    });
  });

  describe('/live', () => {
    it('returns live status', async () => {
      const expectedResp = { status: 'Ok' };

      const response = await request.get('/live');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expectedResp);
    });
  });
});
