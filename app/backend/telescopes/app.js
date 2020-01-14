var express = require('express');
var createError = require('http-errors');
var path = require('path');
var morgan = require('morgan');
var logger = require(path.join(__dirname, 'utilities/logger'));
var telescopeRouter = require(path.join(__dirname, 'components/telescopes/router'));

var app = express();

app.use(morgan('combined', { stream: logger.stream }));

app.use(express.json());

app.use('/api/v1/', telescopeRouter);

app.use(function (req, res, next) {
    next(createError(404));
})

app.use(function (err, req, res, next) {
    var error;
    if (!err.status) {
        error = createError(501);
        error.detail = err;
    } else {
        error = err;
    }
    res.status(error.status);

    logger.info({ err: error });
    res.json({
        'err': error,
    });
})

module.exports = app;