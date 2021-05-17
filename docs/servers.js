const config = require('../config');
const HOST = config.server().HOST;
const PORT = config.server().PORT;

module.exports = {
  servers: [
    {
      url: `http://${HOST}:${PORT}`,
      description: 'Local dev server',
    },
  ],
};
