const Express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const createApp = (router, logger) => {
    const app = Express();

    app.use(cors({ credentials: true }));

    app.use(morgan('combined', { stream: logger.stream }));

    app.use(Express.json());

    app.use('/api/v1/', [router]);

    app.use((req, res, next) => {
        next({
            statusCode: 404,
            body: {
                err: {
                    msg: "Запрашиваемый ресурс не найден."
                }
            }
        });
    })

    app.use((err, req, res, next) => {
        let error = {}
        if (!err.statusCode) {
            error = {
                statusCode: 501,
                body: {
                    err
                }
            }
        } else {
            error = err;
        }

        res.status(error.statusCode);
        res.json(error.body);
        logger.error(error.body);
    })

    return app;
};

module.exports = createApp;