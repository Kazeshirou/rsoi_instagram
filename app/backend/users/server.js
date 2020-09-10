require('dotenv').config();
const http = require('http');
const app = require('./app');
const db = require('./db');
const logger = require('./logger.js');

const server = http.createServer(app);

const start = async () => {
    try {
        await db.sync({});
        server.listen(process.env.PORT);
    } catch {
        logger.error({ msg: "Db is disconnected" });
        exit(1);
    }
};

start();

