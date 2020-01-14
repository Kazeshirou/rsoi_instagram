var express = require('express');
var createError = require('http-errors');
var { check, validationResult } = require('express-validator');
var router = express.Router();
var object = require(__dirname);

router.get('/', [
    check('limit').isInt({ min: 1 }).withMessage("Необходимо целое число >= 1"),
    check('page').isInt({ min: 1 }).withMessage("Необходимо целое число >= 1"),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ err: errors.array() });
        }
        next();
    },
    (req, res, next) => {
    return object.all(req.query.limit || 5, req.query.page || 1)
        .then((objects) => {
            res.json({ 'objects': objects});
        })
        .catch((err) => {
            next(err);
        });
    }
]);

router.get('/count', (req, res, next) => {
    return object.count()
        .then((objects_count) => {
            res.json({ 'objects_count': objects_count });
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:name', (req, res, next) => {
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
    check('id').isInt({ min: 1 }).withMessage("Необходимо целое число >= 1"),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ err: errors.array() });
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
    check('name').not().isEmpty().withMessage("Необходимо задать."),
    check('coord1').not().isEmpty().withMessage("Необходимо задать.").isFloat().withMessage("Необходимо число"),
    check('coord2').not().isEmpty().withMessage("Необходимо задать.").isFloat().withMessage("Необходимо число"),
    check('coord3').not().isEmpty().withMessage("Необходимо задать.").isFloat().withMessage("Необходимо число"),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ err: errors.array() });
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
    check('name').not().isEmpty().withMessage("Необходимо задать."),
    check('coord1').not().isEmpty().withMessage("Необходимо задать.").isFloat().withMessage("Необходимо число"),
    check('coord2').not().isEmpty().withMessage("Необходимо задать.").isFloat().withMessage("Необходимо число"),
    check('coord3').not().isEmpty().withMessage("Необходимо задать.").isFloat().withMessage("Необходимо число"),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ err: errors.array() });
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
    check('id').isInt({ min: 1 }).withMessage("Необходимо целое число >= 1"),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ err: errors.array() });
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