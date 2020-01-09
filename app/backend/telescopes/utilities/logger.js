var winston = require('winston');

var logger = new winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: '../server.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

logger.stream = {
    write: function (message, encoding) {
        // use message.trim() to remove empty line between logged lines
        // https://stackoverflow.com/a/28824464/3109731
        logger.info(message.trim());
    }
};

module.exports = logger;