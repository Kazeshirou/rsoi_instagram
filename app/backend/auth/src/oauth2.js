const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const { CustomError, ValidationError } = require('../../utilities/customErrors');
const logger = require('../logger');
const Users = require('./userModel');
const Clients = require('./clientsModel');

const generateAccessToken = (data, expiresIn) => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: expiresIn ? expiresIn : '2h' });
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
        return { statusCode: 501, msg: "Ошибка при создании пользователя", errors: "Не удалось создать профиль" };

    }
    const token = generateAccessToken({ username: user.username, id: user.id });
    const refreshToken = generateRefreshToken({ token: res.token, user: { username: user.username, id: user.id } });
    return { token, refreshToken, user: { id: res.id, username: user.username } };
}

const checkUser = async ({ username, password }) => {
    const res = await Users.user({ username });
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

const user = async (query) => {
    return await Users.user(query);
}

const createClient = async (clientData) => {
    if (!clientData) {
        const error = new CustomError('Клиент не создан.', 'Не заданы данные клиента.');
        throw logger.custom(error);
    }

    const { client, password } = clientData;
    let salt;
    try {
        salt = await bcrypt.genSalt(10);
    } catch (err) {
        const error = new CustomError('Ошибка при создании клиента.', { salt: err });
        throw logger.custom(error);
    }
    try {
        clientData.password = await bcrypt.hash(password, salt);
    } catch (err) {
        const error = new CustomError('Ошибка при создании клиента.', { hash: err });
        throw logger.custom(error);
    }
    try {
        const res = await Clients.create(clientData);
    } catch (err) {
        if (err instanceof CustomError) {
            throw err;
        }
        const error = new CustomError('Неожиданная ошибка.', err);
        return logger.custom(error);

    }

    const token = generateAccessToken({ client }, '30m');
    return { token, client };
}

const checkClient = async (clientData) => {
    if (!clientData) {
        const error = new CustomError('Клиент не найден.', 'Не заданы данные клиента.');
        throw logger.custom(error);
    }

    const { client, password } = clientData;
    let result;
    try {
        result = await Clients.byClient(client);
    } catch (err) {
        if (err instanceof CustomError) {
            throw err;
        }
        const error = new CustomError('Неожиданная ошибка.', err);
        throw logger.custom(error);
    }

    if (!result) {
        const error = new NotFoundError('Клиент не найден.');
        throw logger.custom(error);
    }
    let compare;
    try {
        compare = await bcrypt.compare(password, result.password);
    } catch (err) {
        const error = new CustomError('Не удалось войти в аккаунт.', err);
        throw logger.custom(error);
    }
    if (!compare) {
        const error = new ValidationError('Не правильные имя клиента и/или пароль.');
        throw logger.custom(error);
    }
    const token = generateAccessToken({ client }, '30m');
    return { token, client };
}

module.exports = { create, checkUser, generateAccessToken, generateRefreshToken, user, createClient, checkClient };