const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Tags = require('./tags');
const Marks = require('./marks');
const logger = require('../logger');
const authentificator = require('../../utilities/autentificator')(logger);

router.post('/tag', [
    async (req, res, next) => {
        if (await Tags.create(req.body)) {
            return res.status(201).end();
        }
        return res.status(501).end();
    }
]);

router.get('/tag', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ tags: await Tags.all() });
    }
]);

router.get('/tag/:value', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ tags: await Tags.byValue(req.params.value) });
    }
]);

router.get('/tag/post/:id', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ tags: await Tags.byPostId(req.params.id) });
    }
]);

router.get('/tag/user/:id', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ tags: await Tags.byUserId(req.params.id) });
    }
]);


router.post('/mark', [
    async (req, res, next) => {
        if (await Tags.create(req.body)) {
            return res.status(201).end();
        }
        return res.status(501).end();
    }
]);

router.get('/mark/post/:id', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ tags: await Tags.byPostId(req.params.id) });
    }
]);

router.get('/mark/user/:id', [
    authentificator.auth,
    async (req, res, next) => {
        return res.json({ tags: await Tags.byUserId(req.params.id) });
    }
]);

module.exports = router;