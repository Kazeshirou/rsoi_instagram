require('dotenv').config();
const http = require('http');
const { exit } = require('process');
const app = require('./app');
const db = require('./db');
const logger = require('./logger.js');

const server = http.createServer(app);

const start = async () => {
    try {
        await db.sync({ force: false });
        server.listen(process.env.PORT);
    } catch (err) {
        logger.error({ msg: "Db is disconnected", detail: err });
        exit(1);
    }
};

start();

