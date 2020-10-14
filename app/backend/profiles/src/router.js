const router = require('express').Router();
const { check } = require('express-validator');
const logger = require('../logger');
const authentificator = require('../../utilities/autentificator')(logger);
const validateInput = require('../../utilities/validateInput');
const Profiles = require('./profiles');

router.post('/private/', [
    authentificator.auth,
    check('username').not().isEmpty().withMessage("Необходимо указать username."),
    check('id').not().isEmpty().withMessage("Необходимо указать id."),
    validateInput,
    async (req, res, next) => {
        if (req.user.client !== process.env.AUTH_NAME) {
            return res.status(401).end();
        }
        if (await Profiles.create(req.body)) {
            return res.status(201).end();
        }
        return res.status(501).end();
    }
]);

router.get('/', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ profiles: await Profiles.all(req.query) });
    }
]);

router.get('/friends/', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ profiles: await Profiles.friends(req.query) });
    }
]);

router.post('/friends/', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ profiles: await Profiles.addFriend(req.body) });
    }
]);

router.get('/private/', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ profiles: await Profiles.all(req.query) });
    }
]);

module.exports = router;