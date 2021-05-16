const crypto = require('crypto');
const qstring = require('querystring');
const bent = require('bent');
const config = require('../../config');
const logger = require('../../utils/logger');

class MarvelClient {
  async _get({ path, offset, limit = 100 }) {
    const context = {
      fileName: __filename,
      operationName: 'MarvelClient._get',
    };
    const RETRIABLE_ERRORS = [408, 429, 500, 502, 503, 504, 508];
    const maxRetries = 10;
    let retries = 1;

    const { API_URL, PRIVATE_KEY, PUBLIC_KEY } = config.marvel();
    const getStream = bent(API_URL, 200);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const ts = Date.now();
        const hash = crypto
          .createHash('md5')
          .update(ts + PRIVATE_KEY + PUBLIC_KEY)
          .digest('hex');

        const params = {
          ts,
          limit,
          offset,
          apikey: PUBLIC_KEY,
          hash,
        };

        logger.info('request sent', context);
        let stream = await getStream(`${path}?${qstring.stringify(params)}`);

        const resp = await stream.json();
        logger.info('response received', context);
        return resp;
      } catch (error) {
        if (retries < maxRetries && RETRIABLE_ERRORS.includes(error.statusCode)) {
          const backOff = Math.pow(2, retries) * 100;
          await this._sleep(backOff);
          retries++;
          logger.info(`retrying request, retries: ${retries}`, context);
          continue;
        }
        const msg = await error.json();
        const err = new Error(`statusCode: ${error.statusCode}, ${JSON.stringify(msg)}`);
        logger.error(err, context);
        throw err;
      }
    }
  }

  _sleep(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  async getAllCharacters() {
    const context = {
      fileName: __filename,
      operationName: 'MarvelClient.getAllCharacters',
    };
    let characters = [];
    let count = 0;
    let total = 0;

    logger.info('retrieving all the characters', context);
    do {
      const result = await this._get({
        path: '/characters',
        offset: count,
      });

      characters = characters.concat(result.data.results);
      count += result.data.count;
      total = result.data.total;
    } while (count < total);

    logger.info('retrieved successfully', context);

    return characters;
  }
}

module.exports = new MarvelClient();
