
var express = require('express');
var createError = require('http-errors');
var router = express.Router();
var telescope = require(__dirname);

router.get('/', async (req, res, next) => {
    return telescope.all()
        .then((telescopes) => {
            res.json({ 'telescopes': telescopes });
        })
        .catch((err) => {
            next(err);
        });
});

router.get('/:name', async (req, res, next) => {
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

router.post('/', async (req, res, next) => {
    return telescope.create(req.body)
        .then((result) => {
            if (result.success) {
                res.status(201).json({ 'telescope': result.telescope });
            } else {
                next(createError(400, result.msg));
            }
        })
        .catch((err) => {
            next(err);
        });
});

router.put('/', async (req, res, next) => {
    return telescope.updateByName(req.body)
        .then((result) => {
            if (result.success) {
                if (result.telescope_num > 0) {
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
    return telescope.deleteByName(req.params.name)
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