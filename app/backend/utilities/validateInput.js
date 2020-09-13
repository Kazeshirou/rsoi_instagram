const { validationResult } = require('express-validator');

const validateInput = (req, res, next) => {
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
}

module.exports = validateInput;