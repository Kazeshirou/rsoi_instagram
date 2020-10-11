const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Posts = require('./posts');
const logger = require('../logger');
const authentificator = require('../../utilities/autentificator')(logger);


router.post('/', [
    async (req, res, next) => {
        if (await Posts.create(req.body)) {
            return res.status(201).end();
        }
        return res.status(501).end();
    }
]);

router.get('/', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ posts: await Posts.all(req.query.page, req.query.limit) });
    }
]);

router.get('/post/:id', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ post: await Posts.byId(req.params.id) });
    }
]);

router.get('/user/:id', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ posts: await Posts.byUserId(req.params.id, req.query.page, req.query.limit) });
    }
]);

module.exports = router;