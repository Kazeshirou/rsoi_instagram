class CustomError extends Error {
    constructor(msg, errors) {
        super(msg);
        this.msg = msg;
        this.errors = errors;
    }
}

class ValidationError extends CustomError {
    constructor(msg, errors) {
        super(msg, errors);
    }
}

class NotFoundError extends CustomError {
    constructor(msg, errors) {
        super(msg, errors);
    }
}

module.exports = { CustomError, ValidationError, NotFoundError };