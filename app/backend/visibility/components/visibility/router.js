
var express = require('express');
var { check, validationResult } = require('express-validator');
var router = express.Router();
var visibility = require(__dirname);

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
    return visibility.all(req.query.limit, req.query.page)
        .then((visibility) => {
            res.json({ 'visibility': visibility});
        })
        .catch((err) => {
            next(err);
        });
}]);

router.get('/count', (req, res, next) => {
    return visibility.count()
        .then((visibility_count) => {
            res.json({ 'visibility_count': visibility_count });
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:id', [
    check('id').isInt(),
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
    return visibility.byId(req.params.id)
        .then((result) => {
            if (result.success) {
                res.json({ 'visibility': result.visibility });
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
    check('telescopeid').isInt({ min: 1 }).withMessage("Необходимо целое число >= 1"),
    check('objectid').isInt({ min: 1 }).withMessage("Необходимо целое число >= 1"),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Ошибки валидации",
                detail: errors.array()
            });
        }
        req.body = {
            telescopeid: req.body.telescopeid,
            objectid: req.body.objectid
        }
        next();
    },
    (req, res, next) => {
    return visibility.create(req.body)
        .then((result) => {
            if (result.success) {
                res.status(201).json({ 'visibility': result.visibility });
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
    return visibility.deleteById(req.params.id)
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

router.delete('/telescopeid/:id', [
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
    return visibility.deleteByTelescopeid(req.params.id)
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

router.delete('/objectid/:id', [
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
    return visibility.deleteByObjectid(req.params.id)
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