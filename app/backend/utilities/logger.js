const winston = require('winston');
const { format, transports } = winston;

const createLogger = (serviceName) => {
    const logger = new winston.createLogger({
        format: format.combine(
            format.label({ label: serviceName }),
            format.timestamp(),
            format.prettyPrint(),
            format.colorize()
        ),
        transports: [
            new transports.File({
                filename: `../my_instagram_${new Date().toISOString().split('T')[0]}_server.log`,
                handleExceptions: true,
                timestamp: true,
                colorize: true,
            })
        ],
        exitOnError: false
    });

    if (process.env.NODE_ENV === 'debug') {
        logger.add(new transports.Console({
            handleExceptions: true,
            colorize: true,
        }));
    }

    logger.stream = {
        write: function (message, encoding) {
            logger.info(message.trim());
        }
    };

    return logger;
};

module.exports = createLogger;