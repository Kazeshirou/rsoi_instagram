
var express = require('express');
var { check, validationResult } = require('express-validator');
var router = express.Router();
var telescope = require(__dirname);

router.get('/', [
    check('limit').isInt({ min: 1 }).withMessage("Необходимо целое число >= 1"),
    check('page').isInt({ min: 0 }).withMessage("Необходимо целое число >= 1"),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Ошибки валидации",
                detail: errors.array()
            });
        }
        next();
    },
    (req, res, next) => {
    return telescope.all(req.query.limit, req.query.page)
        .then((telescopes) => {
            res.json({ 'telescopes': telescopes});
        })
        .catch((err) => {
            next(err);
        });
    }
]);

router.get('/count',  (req, res, next) => {
    return telescope.count()
        .then((telescopes_count) => {
            res.json({ 'telescopes_count': telescopes_count });
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
            return res.status(400).json({
                message: "Ошибки валидации",
                detail: errors.array()
            });
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
    check('name').not().isEmpty().withMessage("Необходимо задать."),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Ошибки валидации",
                detail: errors.array()
            });
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
                res.status(400).json({
                    message: result.msg
                });
            }
        })
        .catch((err) => {
            next(err);
        });
    }
]);

router.put('/', [
    check('name').not().isEmpty().withMessage("Необходимо задать."),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Ошибки валидации",
                detail: errors.array()
            });
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
                res.status(400).json({
                    message: result.msg
                });
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
            return res.status(400).json({
                message: "Ошибки валидации",
                detail: errors.array()
            });
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