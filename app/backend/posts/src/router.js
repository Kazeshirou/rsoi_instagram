const router = require('express').Router();
const { check } = require('express-validator');
const logger = require('../logger');
const authentificator = require('../../utilities/autentificator')(logger);
const validateInput = require('../../utilities/validateInput');
const Posts = require('./posts');


router.post('/', [
    authentificator.auth,
    check('src').not().isEmpty().withMessage("Необходимо указать url изображения."),
    check('userId').not().isEmpty().withMessage("Необходимо указать Id пользователя."),
    check('username').not().isEmpty().withMessage("Необходимо указать username пользователя."),
    validateInput,
    async (req, res, next) => {
        try {
            let post = await Posts.create(req.body);
            return res.status(201).json(post);
        } catch (err) {
            next(err);
        }
    }
]);

router.get('/', [
    authentificator.auth,
    async (req, res, next) => {
        try {
            let posts;
            if (!req.query) {
                posts = await Posts.get();
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
                posts = await Posts.get(query);
            }
            return res.json({ posts });
        } catch (err) {
            next(err);
        }
    }
]);

module.exports = router;