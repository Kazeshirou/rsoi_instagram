require('dotenv').config();
const http = require('http');
const { exit } = require('process');
const app = require('./app');
const logger = require('./logger.js');

const server = http.createServer(app);

const start = async () => {
    try {
        server.listen(process.env.PORT);
    } catch (err) {
        logger.error({ message: err });
        exit(1);
    }
};

start();

