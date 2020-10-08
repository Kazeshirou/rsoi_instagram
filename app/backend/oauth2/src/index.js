const Users = require('./model');
const logger = require('../logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateAccessToken = (data) => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '2h' });
}

const generateRefreshToken = (data) => {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

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
    const res = await Users.create(user);
    if (res.errors) {
        return res;
    }

    res.token = generateAccessToken({ username: user.username });
    res.refreshToken = generateRefreshToken({ token: res.token, user: { username: user.username } });
    return res;
}

const checkUser = async ({ username, password }) => {
    const res = await Users.byUsername(username);
    if (!res) {
        return {
            statusCode: 403, msg: "Не верный логин или пароль.", errors: {}
        }
    }

    try {
        if (!(await bcrypt.compare(password, res.password))) {
            return {
                statusCode: 403, msg: "Не верный логин или пароль.", errors: {}
            };
        }
    } catch {
        return { msg: "Не удалось войти в аккаунт", errors: {} };
    }

    const token = generateAccessToken({ username });
    const refreshToken = generateRefreshToken({ token: res.token, user: { username } });
    return { token, refreshToken, user: { username } };
}

module.exports = { create, checkUser, generateAccessToken, generateRefreshToken };