const createApp = require('../utilities/app');
const logger = require('./logger');
const router = require('./src/router');

const app = createApp(router, logger);

module.exports = app;