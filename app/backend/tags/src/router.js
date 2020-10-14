const router = require('express').Router();
const { check } = require('express-validator');
const logger = require('../logger');
const authentificator = require('../../utilities/autentificator')(logger);
const validateInput = require('../../utilities/validateInput');
const Tags = require('./tags');
const Marks = require('./marks');

router.post('/tags', [
    authentificator.auth,
    check('value').not().isEmpty().withMessage("Необходимо указать значение тега."),
    check('postId').not().isEmpty().withMessage("Необходимо указать id поста."),
    validateInput,
    async (req, res, next) => {
        try {
            req.body.username = tagreq.user.username;
            req.body.userId = tagreq.user.id;
            let tag = await Tags.create(req.body);
            return res.status(201).json(tag);
        } catch (err) {
            next(err);
        }
    }
]);

router.post('/marks', [
    authentificator.auth,
    check('postId').not().isEmpty().withMessage("Необходимо указать id поста."),
    validateInput,
    async (req, res, next) => {
        try {
            req.body.userId = tagreq.user.id;
            req.body.username = tagreq.user.username;
            let mark = await Marks.create(req.body);
            return res.status(201).json(mark);
        } catch (err) {
            next(err);
        }
    }
]);

router.get('/', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            let tags;
            let marks
            if (!req.query) {
                return next();
            } else {
                const { userId, postId, username } = req.query;
                let query = {};
                if (postId) {
                    query.where = {
                        postId
                    };
                } else if (userId) {
                    query.where = {
                        userId
                    };
                } else if (username) {
                    query.where = {
                        username
                    };
                }
                tags = await Tags.get(query);
                marks = await Marks.get(query);
            }
            return res.json({ marks, tags });
        } catch (err) {
            next(err);
        }
    }
]);

router.get('/marks/', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            let marks
            if (!req.query) {
                return next();
            } else {
                const { userId, postId, username } = req.query;
                let query = {};
                if (postId) {
                    query.where = {
                        postId
                    };
                } else if (userId) {
                    query.where = {
                        userId
                    };
                } else if (username) {
                    query.where = {
                        username
                    };
                }
                marks = await Marks.get(query);
            }
            return res.json({ marks });
        } catch (err) {
            next(err);
        }
    }
]);

router.get('/tags/', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            let tags
            if (!req.query) {
                return next();
            } else {
                const { userId, postId, value, username } = req.query;
                let query = {};
                if (postId) {
                    query.where = {
                        postId
                    };
                } else if (userId) {
                    query.where = {
                        userId
                    };
                } else if (value) {
                    query.where = {
                        value
                    };
                } else if (username) {
                    query.where = {
                        username
                    };
                }
                tags = await Tags.get(query);
            }
            return res.json({ tags });
        } catch (err) {
            next(err);
        }
    }
]);

router.get('/private/', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            let tags;
            let marks
            if (!req.query) {
                return next();
            } else {
                const { userId, postId, username } = req.query;
                let query = {};
                if (postId) {
                    query.where = {
                        postId
                    };
                } else if (userId) {
                    query.where = {
                        userId
                    };
                } else if (username) {
                    query.where = {
                        username
                    };
                }
                tags = await Tags.get(query);
                marks = await Marks.get(query);
            }
            return res.json({ marks, tags });
        } catch (err) {
            next(err);
        }
    }
]);

module.exports = router;