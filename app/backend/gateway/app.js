var express = require('express');
var createError = require('http-errors');
var path = require('path');

var telescopeRouter = require(path.join(__dirname, 'components/telescopes/router'));

var app = express();

app.use(express.json());

app.use('/', telescopeRouter);
app.use('/telescopes', telescopeRouter);

app.use(function (req, res, next) {
    next(createError(404));
})

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        'err': req.app.get('env') === 'development' ? err : {},
    });
})

module.exports = app;