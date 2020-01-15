
var express = require('express');
var router = express.Router();
var visibility = require(__dirname);

router.get('/', (req, res, next) => {
    req.query.page = req.query.page || 0;
    req.query.limit = req.query.limit || 3;
    return visibility.all(req.query)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/count', (req, res, next) => {
    return visibility.count()
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:id', (req, res, next) => {
    return visibility.byId(req.params.id)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/', (req, res, next) => {
    return visibility.create(req.body)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/:id', (req, res, next) => {
    return visibility.deleteById(req.params.id)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/telescopeid/:id', (req, res, next) => {
    return visibility.deleteByTelescopeid(req.params.id)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/objectid/:id', (req, res, next) => {
    return visibility.deleteByObjectid(req.params.id)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;