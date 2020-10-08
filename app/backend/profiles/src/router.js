const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Profiles = require('./profiles');
const logger = require('../logger');
const authentificator = require('../../utilities/autentificator')(logger);

router.get('/', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ users: await Profiles.byUser(req.user); });
    }
]);

module.exports = router;