
var express = require('express');
var router = express.Router();
var visibility = require(__dirname);

router.get('/', async (req, res, next) => {
    req.query.page = req.query.page || 1;
    req.query.limit = req.query.limit || 3;
    return visibility.all(req.query)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            console.log(err)
            next(err);
        });
});

router.get('/count', async (req, res, next) => {
    return visibility.count()
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:name', async (req, res, next) => {
    return visibility.byName(req.params.name)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/', async (req, res, next) => {
    return visibility.create(req.body)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.put('/', async (req, res, next) => {
    return visibility.updateByName(req.body)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/:name', async (req, res, next) => {
    return visibility.deleteByName(req.params.name)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;