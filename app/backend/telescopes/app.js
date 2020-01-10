var express = require('express');
var createError = require('http-errors');
var path = require('path');
var morgan = require('morgan');
var logger = require(path.join(__dirname, 'utilities/logger'));
var telescopeRouter = require(path.join(__dirname, 'components/telescopes/router'));

var app = express();

app.use(morgan('combined', { stream: logger.stream }));

app.use(express.json());

app.use('/api/', telescopeRouter);

app.use(function (req, res, next) {
    next(createError(404));
})

app.use(function (err, req, res, next) {
    res.status(err.status || 501);
    res.json({
        'err': req.app.get('env') == 'development' ? err : {},
    });
})

module.exports = app;