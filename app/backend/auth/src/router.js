const router = require('express').Router();
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');

const { CustomError, ValidationError } = require('../../utilities/customErrors');
const logger = require('../logger');
const validateInput = require('../../utilities/validateInput');

const Users = require('./oauth2');

router.post('/registration', [
    check('username').not().isEmpty().withMessage("Необходимо ввести логин."),
    check('username').isLength({ min: 3 }).withMessage("Логин слишком короткий (минимум 3 символа)."),
    check('username').matches(/^[a-zA-Z_]+$/).withMessage("Логин должен содержать только латинские буквы и символ '_'."),
    check('password').not().isEmpty().withMessage("Необходимо ввести пароль."),
    check('password').isLength({ min: 8 }).withMessage("Пароль слишком короткий (минимум 8 символов)."),
    check('password').matches(/(?=.*[0-9])/).withMessage("Пароль должен содержать хотя бы одну цифру."),
    check('password').matches(/(?=.*[A-Za-zа-яА-Я])/).withMessage("Пароль должен содержать хотя бы одну букву."),
    check('email').not().isEmpty().withMessage("Необходимо ввести почту."),
    check('email').isEmail().withMessage("Некорректный формат почтового адреса."),

    validateInput,

    async (req, res, next) => {
        const { username, password, email } = req.body;
        const result = await Users.create({ username, password, email });
        if (result.errors) {
            const { msg, errors, statusCode } = result;
            res.status(statusCode ? statusCode : 501);
            return res.json({ msg, errors })
        }
        return res.json(result);
    }
]);

router.post('/login', [
    check('username').not().isEmpty().withMessage("Необходимо ввести логин."),
    check('username').isLength({ min: 3 }).withMessage("Логин слишком короткий (минимум 3 символа)."),
    check('username').matches(/^[a-zA-Z_]+$/).withMessage("Логин должен содержать только латинские буквы и символ '_'."),
    check('password').not().isEmpty().withMessage("Необходимо ввести пароль."),
    check('password').isLength({ min: 8 }).withMessage("Пароль слишком короткий (минимум 8 символов)."),
    check('password').matches(/(?=.*[0-9])/).withMessage("Пароль должен содержать хотя бы одну цифру."),
    check('password').matches(/(?=.*[A-Za-zа-яА-Я])/).withMessage("Пароль должен содержать хотя бы одну букву."),

    validateInput,

    async (req, res, next) => {
        const { username, password } = req.body;
        const result = await Users.checkUser({ username, password });
        if (result.errors) {
            const { msg, errors, statusCode } = result;
            res.status(statusCode ? statusCode : 501);
            return res.json({ msg, errors })
        }
        return res.json(result);
    },
]);

const auth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;

        next();
    });
}

router.get('/auth', [
    auth,
    (req, res, next) => {
        return res.json(req.user);
    }
]);

router.post('/refresh', [
    (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const refreshToken = authHeader && authHeader.split(' ')[1];
        if (refreshToken == null) {
            return res.sendStatus(401);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
            if (err || (data.token !== req.body.token)) {
                return res.sendStatus(403);
            }
            let newToken = Users.generateAccessToken(data.user);
            let refreshToken = Users.generateRefreshToken(newToken);
            res.json({ token, refreshToken });
        })
    }
]);

router.get('/user', [
    auth,
    async (req, res, next) => {
        const user = await Users.user(req.query);
        if (user) {
            return res.json({ user });
        }
        return res.status(404).end();
    }
]);

// Регистрация клиентов.
router.post('/client', [
    async (req, res, next) => {
        try {
            const client = await Users.createClient(req.body);
            return res.json(client);
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(403).json(err);
            }

            if (err instanceof CustomError) {
                return next(err);
            }
            const error = new CustomError('Неожиданная ошибка', err);
            return next(logger.custom(error));
        }
    }
]);

// Получение токена клиентом.
router.get('/client_token', [
    async (req, res, next) => {
        try {
            const client = await Users.checkClient(req.query);
            return res.json(client);
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(403).json(err);
            }

            if (err instanceof CustomError) {
                return next(err);
            }
            const error = new CustomError('Неожиданная ошибка', err);
            return next(logger.custom(error));

        }
    }
]);

module.exports = router;