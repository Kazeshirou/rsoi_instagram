
var express = require('express');
var createError = require('http-errors');
var { check, validationResult } = require('express-validator');
var router = express.Router();
var telescope = require(__dirname);

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
    return telescope.all(req.query.limit || 5, req.query.page || 1)
        .then((telescopes) => {
            res.json({ 'telescopes': telescopes});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
    }
]);

router.get('/count', async (req, res, next) => {
    return telescope.count()
        .then((telescopes_count) => {
            res.json({ 'telescopes_count': telescopes_count });
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
    return telescope.byId(req.params.id)
        .then((result) => {
            if (result.success) {
                res.json({ 'telescope': result.telescope });
            } else {
                next();
            }
        })
        .catch((err) => {
            next(err);
        });
    }
]);

router.get('/:name', (req, res, next) => {
    return telescope.byName(req.params.name)
        .then((result) => {
            if (result.success) {
                res.json({ 'telescope': result.telescope });
            } else {
                next();
            }
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/', [
    check('name').isLength({min: 1}),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ err: errors.array() });
        }
        req.body = {
            name: req.body.name,
            city: req.body.city,
            country: req.body.country
        }
        next();
    },
    (req, res, next) => {
    return telescope.create(req.body)
        .then((result) => {
            if (result.success) {
                res.status(201).json({ 'telescope': result.telescope });
            } else {
                next(createError(422, result.msg));
            }
        })
        .catch((err) => {
            next(err);
        });
    }
]);

router.put('/', [
    check('name').isLength({ min: 1 }),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ err: errors.array() });
        }
        req.body = {
            name: req.body.name,
            city: req.body.city,
            country: req.body.country
        }
        next();
    },
    (req, res, next) => {
    return telescope.updateByName(req.body)
        .then((result) => {
            if (result.success) {
                if (result.telescope_num > 0) {
                    res.status(204).end();
                } else {
                    next();
                }
            } else {
                next(createError(422, result.msg));
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
    return telescope.deleteById(req.params.id)
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