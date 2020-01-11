
var express = require('express');
var { check, validationResult } = require('express-validator');
var createError = require('http-errors');
var router = express.Router();
var visibility = require(__dirname);

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
    return visibility.all(req.query.limit || 5, req.query.page || 1)
        .then((visibility) => {
            res.json({ 'visibility': visibility});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
}]);

router.get('/count', async (req, res, next) => {
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
            return res.status(422).json({ err: errors.array() });
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
    check('telescopeid').isInt(),
    check('objectid').isInt(),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ err: errors.array() });
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
    check('id').isInt(),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ err: errors.array() });
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
    check('id').isInt(),
    (req, res, next) => {
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ err: errors.array() });
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