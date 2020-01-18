var winston = require('winston');
var format = winston.format;

var logger = new winston.createLogger({
    format: format.combine(
        format.label({ label: 'oauth'}),
        format.timestamp(),
        format.prettyPrint(),
        format.colorize()
    ),
    transports: [
        new winston.transports.File({
            filename: '../' +  new Date().toISOString().split('T')[0] + '_server.log',
            handleExceptions: true,
            timestamp : true,
            colorize: true,
        })
    ],
    exitOnError: false
});

if (process.env.NODE_ENV !== 'test') {
    logger.add(new winston.transports.Console({
        handleExceptions: true,
        colorize: true,
    }));
}

logger.stream = {
    write: function (message, encoding) {
        logger.info(message.trim());
    }
};

module.exports = logger;