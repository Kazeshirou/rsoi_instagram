
var express = require('express');
var router = express.Router();
var telescope = require(__dirname);

router.get('/', async (req, res, next) => {
    req.query.page = req.query.page || 1;
    req.query.limit = req.query.limit || 3;
    return telescope.all(req.query)
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

router.get('/id/:id', async (req, res, next) => {
    return telescope.byId(req.params.id)
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

router.delete('/:id', async (req, res, next) => {
    return telescope.deleteById(req.params.id)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;