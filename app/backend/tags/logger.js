const getLogger = require("../utilities/logger.js");

const logger = getLogger(process.env.SERVICE_NAME);

module.exports = logger;