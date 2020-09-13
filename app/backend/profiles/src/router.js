const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Profiles = require('./profiles');

router.get('/', [
    async (req, res, next) => {
        return res.json({ users: await Profiles.all(0, 10) });
    }
]);

module.exports = router;