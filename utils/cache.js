const LRU = require('lru-cache');

const fifteenMinutes = 1000 * 60 * 15;

const cache = new LRU({
  max: 1,
  length: function () {
    return 1;
  },
  maxAge: fifteenMinutes,
});

module.exports = cache;
