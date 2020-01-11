var express = require('express');
var createError = require('http-errors');
var { check, validationResult } = require('express-validator');
var router = express.Router();
var object = require(__dirname);

router.get('/', [
    check('limit').isInt(),
    check('page').isInt(),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ err: errors.array() });
        }
        next();
    },
    (req, res, next) => {
    return object.all(req.query.limit || 5, req.query.page || 1)
        .then((objects) => {
            res.json({ 'objects': objects});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
    }
]);

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

router.get('/id/:id', [
    check('id').isInt(),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ err: errors.array() });
        }
        next();
    },
    (req, res, next) => {
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
    }
]);

router.post('/', [
    check('name').isLength({ min: 1 }),
    check('coord1').isFloat(),
    check('coord2').isFloat(),
    check('coord3').isFloat(),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ err: errors.array() });
        }
        req.body = {
            name: req.body.name,
            coord1: req.body.coord1,
            coord2: req.body.coord2,
            coord3: req.body.coord3
        }
        next();
    },
    (req, res, next) => {
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
    }
]);

router.put('/', [
    check('name').isLength({ min: 1 }),
    check('coord1').isFloat(),
    check('coord2').isFloat(),
    check('coord3').isFloat(),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ err: errors.array() });
        }
        req.body = {
            name: req.body.name,
            coord1: req.body.coord1,
            coord2: req.body.coord2,
            coord3: req.body.coord3
        }
        next();
    },
    (req, res, next) => {
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
    }
]);

router.delete('/:id', [
    check('id').isInt(),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ err: errors.array() });
        }
        next();
    },
    (req, res, next) => {
    return object.deleteById(req.params.id)
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
    }
]);

module.exports = router;