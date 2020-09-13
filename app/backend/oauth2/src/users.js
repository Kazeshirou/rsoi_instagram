const Users = require('./model');
const logger = require('../logger');
const bcrypt = require('bcrypt');

const create = async (user) => {
    let salt;
    try {
        salt = await bcrypt.genSalt(10);
    } catch (err) {
        logger.error(err);
        return { statusCode: 501, msg: "Ошибка при создании пользователя", errors: "Не удалось подготовить пароль" };
    }
    try {
        user.password = await bcrypt.hash(user.password, salt);
    } catch (err) {
        logger.error(err);
        return { statusCode: 501, msg: "Ошибка при создании пользователя", errors: "Не удалось подготовить пароль" };
    }
    return await Users.create(user);
}

const all = async (page, limit) => {
    return await Users.all(page, limit);
}

const byId = async (id) => {
    return await Users.byId(id);
}

module.exports = { create, all, byId };