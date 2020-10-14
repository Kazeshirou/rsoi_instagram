const Express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { NotFoundError, ValidationError, CustomError } = require('./customErrors');

const createApp = (router, logger) => {
    const app = Express();

    app.use(cors({ credentials: true }));

    app.use(morgan('combined', { stream: logger.stream }));

    app.use(Express.json());

    app.use('/api/v1/', [router]);

    app.use((req, res, next) => {
        next(new NotFoundError('Запрашиваемый ресурс не найден.'));
    })

    app.use((err, req, res, next) => {
        if (err instanceof NotFoundError) {
            res.status(404);
        } else if (err instanceof ValidationError) {
            res.status(403);
        } else if (err instanceof CustomError) {
            res.status(501)
        } else {
            res.status(501);
            err = logger.custom(new CustomError('Неожиданная ошибка', err));
        }
        res.json(err);
    })

    return app;
};

module.exports = createApp;