const axios = require('axios');
const logger = require('../logger');

const getUserByUserId = async (token, userid) => {
    const opt = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    try {
        const res = await axios.get(`${process.env.AUTH_URL}/?username=${userid}`);
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