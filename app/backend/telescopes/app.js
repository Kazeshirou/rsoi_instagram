var express = require('express');
var path = require('path');
var morgan = require('morgan');
var logger = require(path.join(__dirname, 'utilities/logger'));
var auth = require(path.join(__dirname, 'utilities/auth'));

var telescopeRouter = require(path.join(__dirname, 'components/telescopes/router'));

var app = express();

app.use(morgan('combined', { stream: logger.stream }));

app.use(express.json());

app.get('/api/v1/token', [auth.isAuthenticated, (req, res) => {
    auth.generateToken(req.user._id)
        .then(token => res.json(token))
        .catch(() => res.status(501).end());
}]);

app.use('/api/v1/', [auth.isBearerAuthenticated, telescopeRouter]);

app.use((req, res, next) => {
    next({
        statusCode: 404,
        body: {
            err: {
                message: "Запрашиваемый ресурс не найден."
            }
        }
    });
})

app.use(function (err, req, res, next) {
    var error = {}
    if (!err.statusCode) {
        error = {
            statusCode: 501,
            body: {
                err: {
                    message: "Неожиданная ошибка сервера.",
                    detail: err
                }
            }
        }
    } else {
        error = err;
    }

    res.status(error.statusCode);
    res.json(err.body);
    logger.error(error.body);
})

module.exports = app;