
var express = require('express');
var router = express.Router();
var telescope = require(__dirname);

router.get('/', async (req, res, next) => {
    return telescope.all()
        .then((telescopes) => {
            res.json({ 'telescopes': telescopes });
        })
        .catch((err) => {
            console.log(err);
            res.status(501).json(err);
        });
});

router.get('/:name', async (req, res, next) => {
    return telescope.byName(req.params.name)
        .then((result) => {
            if (result.success) {
                res.json({ 'telescope': result.telescope });
            } else {
                res.status(404).end();
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(501).json(err);
        });
});

router.post('/', async (req, res, next) => {
    return telescope.create(req.query.name, req.query.type, req.query.country, req.query.city)
        .then((result) => {
            if (result.success) {
                res.status(201).json({ 'telescope': result.telescope });
            } else {
                res.status(400).json({'error message' : result.msg});
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(501).json(err);
        });
});

router.put('/', async (req, res, next) => {
    return telescope.updateByName(req.query.name, req.query.type, req.query.country, req.query.city)
        .then((result) => {
            if (result.success) {
                if (result.telescope_num > 0) {
                    res.status(204).end();
                } else {
                    res.status(404).end();
                }
            } else {
                res.status(400).json({'error message' : result.msg});
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(501).json(err);
        });
});

router.delete('/:name', async (req, res, next) => {
    return telescope.deleteByName(req.params.name)
        .then((success) => {
            if (success.success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(501).json(err);
        });
});

module.exports = router;