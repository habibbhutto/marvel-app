const getAllCharacters = require('./get.all.characters');
const getCharacters = require('./get.characters');

module.exports = {
  paths: {
    '/characters': {
      ...getAllCharacters,
    },
    '/characters/{id}': {
      ...getCharacters,
    },
  },
};
