const axios = require('axios');
const logger = require('../logger');

const getUserByUsername = async (username) => {
    try {
        const res = await axios.get(`${process.env.PROFILES_URL}/?username=${username}`);
        return res.data;
    } catch (err) {
        if (err.response) {
            logger.custom_error('Не удалось получить пользователя по username', { status: err.response.status, body: err.response.data });
        } else if (err.request) {
            logger.custom_error('Не удалось получить пользователя по username', { request: err.request });
        } else {
            logger.custom_error('Не удалось получить пользователя по username', { error: error.message });
        }

        return null;
    }
}

const getUserByUserId = async (userid) => {
    try {
        const res = await axios.get(`${process.env.PROFILES_URL}/?username=${userid}`);
        return res.data;
    } catch (err) {
        if (err.response) {
            logger.custom_error('Не удалось получить пользователя по userid', { status: err.response.status, body: err.response.data });
        } else if (err.request) {
            logger.custom_error('Не удалось получить пользователя по userid', { request: err.request });
        } else {
            logger.custom_error('Не удалось получить пользователя по userid', { error: error.message });
        }

        return null;
    }
}

module.exports = { getUserByUserId, getUserByUsername };