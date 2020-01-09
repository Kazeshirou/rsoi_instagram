var Sequelize = require('sequelize');
var path = require('path');
var config = require(path.join(__dirname, '../config/', (process.env.NODE_ENV || 'development')));

var db = new Sequelize(config.db.connectionString); 

module.exports = db;