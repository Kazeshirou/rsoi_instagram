const { validationResult } = require('express-validator');
const { ValidationError } = require('./customErrors');

const validateInput = (req, res, next) => {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        return msg;
    };
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        next(new ValidationError('Ошибки валидации', errors.mapped()));
    }
    next();
}

module.exports = validateInput;