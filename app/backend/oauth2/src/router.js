const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Users = require('./users');

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

    async (req, res, next) => {
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return msg;
        };
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                msg: "Ошибки валидации",
                errors: errors.mapped()
            });
        }
        next();
    },
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

router.get('/login', [
    async (req, res, next) => {
        return res.json({ users: await Users.all(0, 10) });
    }
]);

router.get('/auth', [
    async (req, res, next) => {
        return res.json({ users: await Users.all(0, 10) });
    }
]);

module.exports = router;