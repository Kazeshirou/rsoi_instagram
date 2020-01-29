var http = require('http');
var path = require('path');
var config = require(path.join(__dirname,'/config/', (process.env.NODE_ENV || 'development')));
var app = require(path.join(__dirname,'app'));
var db = require(path.join(__dirname, '/db'));
var logger = require(path.join(__dirname, 'utilities/logger'));

var server = http.createServer(app);
var port = normalizePort(process.env.PORT || config.port);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/telescopesdb', { useNewUrlParser: true });
var dbmongo = mongoose.connection;
dbmongo.on('error', console.error.bind(console, 'connection error:'));
dbmongo.once('open', function () {
    logger.info("mongo db connected")
});
mongoose.set('useCreateIndex', true)
mongoose.set('debug', function (coll, method, query, doc, options) {
    let set = {
        coll: coll,
        method: method,
        query: query,
        doc: doc,
        options: options
    };

    logger.info({
        dbQuery: set
    });
});

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
