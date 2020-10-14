const router = require('express').Router();
const { check } = require('express-validator');
const logger = require('../logger');
const authentificator = require('../../utilities/autentificator')(logger);
const validateInput = require('../../utilities/validateInput');
const Posts = require('./posts');


router.post('/', [
    authentificator.auth,
    check('src').not().isEmpty().withMessage("Необходимо указать url изображения."),
    validateInput,
    async (req, res, next) => {
        try {
            req.body.userId = req.user.id;
            req.body.username = req.user.username;
            let post = await Posts.create(req.body);
            return res.status(201).json(post);
        } catch (err) {
            return next(err);
        }
    }
]);

router.get('/', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            let posts;
            if (!req.query) {
                posts = await Posts.get({}, req.user.id);
            } else {
                const { page, limit, id, userId } = req.query;
                let query = {};
                if (page && limit) {
                    query.page = page;
                    query.limit = limit;
                }
                if (id) {
                    query.where = {
                        id
                    };
                } else if (userId) {
                    query.where = {
                        userId
                    };
                }
                posts = await Posts.get(query, req.user.id);
            }
            return res.json({ posts });
        } catch (err) {
            next(err);
        }
    }
]);

module.exports = router;