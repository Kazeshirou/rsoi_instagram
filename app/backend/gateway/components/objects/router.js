
var express = require('express');
var router = express.Router();
var object = require(__dirname);

router.get('/', async (req, res, next) => {
    req.query.page = req.query.page || 1;
    req.query.limit = req.query.limit || 3;
    return object.all(req.query)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            console.log(err)
            next(err);
        });
});

router.get('/count', async (req, res, next) => {
    return object.count()
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:name', async (req, res, next) => {
    return object.byName(req.params.name)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/id/:id', async (req, res, next) => {
    return object.byId(req.params.id)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/', async (req, res, next) => {
    return object.create(req.body)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.put('/', async (req, res, next) => {
    return object.updateByName(req.body)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/:name', async (req, res, next) => {
    return object.deleteByName(req.params.name)
        .then((result) => {
            res.status(result.statusCode).json(result.body);
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;