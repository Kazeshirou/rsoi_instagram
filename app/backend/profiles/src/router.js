const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Profiles = require('./profiles');
const logger = require('../logger');
const authentificator = require('../../utilities/autentificator')(logger);


router.post('/', [
    async (req, res, next) => {
        if (await Profiles.create(req.body)) {
            return res.status(201).end();
        }
        return res.status(501).end();
    }
]);

router.get('/', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ profiles: await Profiles.all(req.query.page, req.query.limit) });
    }
]);

router.get('/profile/:username', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ profile: await Profiles.byUsername(req.params.username) });
    }
]);

module.exports = router;