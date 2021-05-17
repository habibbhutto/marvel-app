const info = require('./info');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const operations = require('./characters');
module.exports = {
  ...info,
  ...servers,
  ...components,
  ...tags,
  ...operations,
};
