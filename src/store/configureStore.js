/* eslint-disable global-require */
const env = process.env.NODE_ENV
if (env === 'production') {
  module.exports = require('./configureStore.prod')
// } else if (env === 'stage') {
  // module.exports = require('./configureStore.stg')
} else {
  module.exports = require('./configureStore.dev')
}
