const marvelClient = require('./marvel.client');
const mockData = require('./test-data.json');
const nock = require('nock');

jest.mock('../../utils/logger');

describe('MarvelClient', () => {
  const MARVEL_API_URL = 'https://gateway.dummymarvel.com/v1/public';
  process.env.MARVEL_API_URL = MARVEL_API_URL;
  process.env.MARVEL_PUBLIC_KEY = 'dummy public key';
  process.env.MARVEL_PRIVATE_KEY = 'dummy private key';

  describe('getAllCharacters()', () => {
    afterAll(() => {
      nock.restore();
      jest.restoreAllMocks();
    });
    it('retrieves all characters', async () => {
      const respData = Object.assign({}, mockData);
      respData.data.total = 100;
      respData.data.count = 100;

      /* arrange */
      nock(MARVEL_API_URL).get('/characters').query(true).once().reply(200, respData);

      /* act */
      const results = await marvelClient.getAllCharacters();

      /* assert */
      expect(results.length).toBe(100);
      expect(results[0].id).toBeGreaterThan(0);
    });

    it('retrieves all characters with pagination', async () => {
      const respData1 = Object.assign({}, mockData);
      respData1.data.total = 200;
      respData1.data.count = 100;

      const respData2 = Object.assign({}, mockData);
      respData2.data.total = 200;
      respData2.data.count = 100;
      respData2.data.offset = 100;

      /* arrange */
      nock(MARVEL_API_URL).get('/characters').query(true).once().reply(200, respData1);

      nock(MARVEL_API_URL).get('/characters').query(true).once().reply(200, respData2);

      /* act */
      const results = await marvelClient.getAllCharacters();

      /* assert */
      expect(results.length).toBe(200);
      expect(results[0].id).toBeGreaterThan(0);
    });

    it('retries on transient errors', async () => {
      const respData1 = Object.assign({}, mockData);
      respData1.data.total = 200;
      respData1.data.count = 100;

      const respData2 = Object.assign({}, mockData);
      respData2.data.total = 200;
      respData2.data.count = 100;
      respData2.data.offset = 100;

      /* arrange */
      nock(MARVEL_API_URL).get('/characters').query(true).once().reply(200, respData1);

      nock(MARVEL_API_URL).get('/characters').query(true).once().reply(500, { message: 'internal server error' });

      nock(MARVEL_API_URL).get('/characters').query(true).once().reply(200, respData2);

      /* act */
      const results = await marvelClient.getAllCharacters();

      /* assert */
      expect(results.length).toBe(200);
      expect(results[0].id).toBeGreaterThan(0);
    });

    it('throws error', async () => {
      /* arrange */
      nock(MARVEL_API_URL).get('/characters').query(true).reply(400, { message: 'Bad request' });

      /* act */
      let actualError;
      try {
        await marvelClient.getAllCharacters();
      } catch (error) {
        actualError = error;
      }

      /* assert */
      expect(actualError.message).toBe('statusCode: 400, {"message":"Bad request"}');
    });
  });
});
