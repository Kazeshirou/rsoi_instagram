var http = require('http');
var path = require('path');
var config = require(path.join(__dirname,'/config/', (process.env.NODE_ENV || 'development')));
var app = require(path.join(__dirname,'app'));
var db = require(path.join(__dirname, '/db'));
var logger = require(path.join(__dirname, 'utilities/logger'));

var server = http.createServer(app);
var port = normalizePort(process.env.PORT || config.port);

db
    .sync()
    .then(() => {
        logger.info('Tables have been sync successfully.');
        server.listen(port);        
        
    })
    .catch(err => {
        logger.error('Unable to sync tables');
        exit(1);
    });



function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}
