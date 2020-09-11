const { Sequelize } = require('sequelize');

const logger = require('./logger');

const db = new Sequelize(process.env.DB_STRING, { logging: msg => logger.stream.write(msg) });

module.exports = db;