var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var object = require(__dirname);

router.get('/', async (req, res, next) => {
    return object.all(req.query.limit || 5, req.query.page || 1)
        .then((objects) => {
            res.json({ 'objects': objects});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

router.get('/count', async (req, res, next) => {
    return object.count()
        .then((objects_count) => {
            res.json({ 'objects_count': objects_count });
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:name', async (req, res, next) => {
    return object.byName(req.params.name)
        .then((result) => {
            if (result.success) {
                res.json({ 'object': result.object });
            } else {
                next();
            }
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/id/:id', async (req, res, next) => {
    return object.byId(req.params.id)
        .then((result) => {
            if (result.success) {
                res.json({ 'object': result.object });
            } else {
                next();
            }
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/', async (req, res, next) => {
    return object.create(req.body)
        .then((result) => {
            if (result.success) {
                res.status(201).json({ 'object': result.object });
            } else {
                next(createError(400, result.msg));
            }
        })
        .catch((err) => {
            next(err);
        });
});

router.put('/', async (req, res, next) => {
    return object.updateByName(req.body)
        .then((result) => {
            if (result.success) {
                if (result.object_num > 0) {
                    res.status(204).end();
                } else {
                    next();
                }
            } else {
                next(createError(400, result.msg));
            }
        })
        .catch((err) => {
            next(err);
        });
});

router.delete('/:name', async (req, res, next) => {
    return object.deleteByName(req.params.name)
        .then((success) => {
            if (success.success) {
                res.status(204).end();
            } else {
                next();
            }
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = router;