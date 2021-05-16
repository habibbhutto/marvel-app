const LRU = require('lru-cache');

const fifteenMinutes = 1000 * 60 * 15;

const cache = new LRU({
  max: 400,
  length: function (n) {
    return n.length;
  },
  dispose: function (key, n) {
    n.close();
  },
  maxAge: fifteenMinutes,
});

module.exports = cache;
