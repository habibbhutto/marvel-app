const supertest = require('supertest');
const testData = require('./services/clients/test-data.json');
const { marvelService } = require('./services');
const app = require('./app');

const request = supertest(app);

jest.mock('./services');

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
    });

    it('throws internal server error', async () => {
      marvelService.getCharacters = jest.fn(() => {
        throw new Error('Internal server error');
      });

      const response = await request.get('/characters');

      expect(response.statusCode).toBe(500);
      expect(response.body).not.toBeNull();
      expect(response.body.message).toBe('Internal server error');
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
