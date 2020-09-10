const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Users = require('./users');

router.get('/', [
    async (req, res, next) => {
        return res.json({ users: await Users.all(0, 10) });
    }
]);

module.exports = router;