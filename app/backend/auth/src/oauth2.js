const Users = require('./model');
const logger = require('../logger');
const bcrypt = require('bcrypt');
const axios = require('axios');
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
    try {
        const profile_res = await axios.post(`${process.env.PROFILES_URL}/`, {
            username: user.username,
            id: res.id
        });
    } catch (err) {
        if (err.response) {
            logger.error({ message: { info: 'Создание профиля пользователя', status: err.response.status, body: err.response.data } });
        } else if (err.request) {
            logger.error({ message: { info: 'Создание профиля пользователя', request: err.request } });
        } else {
            logger.error({ message: { info: 'Создание профиля пользователя', error: error.message } });
        }
        await Users.deleteById(res.id);
        console.log(res);
        return { statusCode: 501, msg: "Ошибка при создании пользователя", errors: "Не удалось создать профиль" };

    }
    const token = generateAccessToken({ username: user.username, id: user.id });
    const refreshToken = generateRefreshToken({ token: res.token, user: { username: user.username, id: user.id } });
    return { token, refreshToken, user: { id: res.id, username: user.username } };
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
    const token = generateAccessToken({ username, id: res.id });
    const refreshToken = generateRefreshToken({ token: res.token, user: { username, id: res.id } });
    return { token, refreshToken, user: { id: res.id, username } };
}

module.exports = { create, checkUser, generateAccessToken, generateRefreshToken };