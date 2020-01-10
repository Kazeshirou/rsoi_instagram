
var express = require('express');
var router = express.Router();
var telescope = require(__dirname);

router.get('/', async (req, res, next) => {
    return telescope.all(req.body.limit || 3, req.body.page || 1)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            console.log(err)
            next(err);
        });
});

router.get('/count', async (req, res, next) => {
    return telescope.count()
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:name', async (req, res, next) => {
    return telescope.byName(req.params.name)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/', async (req, res, next) => {
    return telescope.create(req.body)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.put('/', async (req, res, next) => {
    return telescope.updateByName(req.body)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/:name', async (req, res, next) => {
    return telescope.deleteByName(req.params.name)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;