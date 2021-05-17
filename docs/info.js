const { version } = require('../package.json');
// const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Marvel App API documentation',
    description: 'A demo application for Marvel API integration',
    version,
    license: {
      name: 'MIT',
      url: '',
    },
  },
};

module.exports = swaggerDef;
