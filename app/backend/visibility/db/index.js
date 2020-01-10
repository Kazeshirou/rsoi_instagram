var Sequelize = require('sequelize');
var path = require('path');
var config = require(path.join(__dirname, '../config/', (process.env.NODE_ENV || 'development')));
var logger = require(path.join(__dirname, '../utilities/logger'));

var db = new Sequelize(config.db.connectionString,
    process.env.NODE_ENV || 'development' ? { logging: msg => logger.stream.write(msg) } : {}); 

module.exports = db;