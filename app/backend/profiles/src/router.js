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
        try {
            const user = await Profiles.create(req.body);
            return res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }
]);

router.get('/', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            return res.json({ profiles: await Profiles.get(req.query) });
        } catch (err) {
            next(err);
        }
    }
]);

router.put('/', [
    authentificator.auth,
    // check('age').isNumeric().withMessage("Возраст должен быть числом"),
    // validateInput,
    async (req, res, next) => {
        try {
            req.body.id = undefined;
            req.body.username = req.user.username;
            if (req.body.age === "") {
                req.body.age = undefined;
            }
            return res.json({ profiles: await Profiles.update(req.user.id, req.body) });
        } catch (err) {
            next(err)
        }
    }
]);

router.get('/friends/', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            return res.json({ profiles: await Profiles.friends(req.query) });
        } catch (err) {
            next(err);
        }
    }
]);

router.post('/friends/', [
    authentificator.auth,
    check('friendId').not().isEmpty().withMessage("Необходимо указать friendId."),
    async (req, res, next) => {
        try {
            return res.json({ profiles: await Profiles.addFriend(req.user.id, req.body.friendId) });
        } catch (err) {
            next(err);
        }
    }
]);

router.get('/private/', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            return res.json({ profiles: await Profiles.get(req.query) });
        } catch (err) {
            next(err);
        }
    }
]);

module.exports = router;