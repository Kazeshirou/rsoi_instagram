const axios = require('axios');
const { CustomError } = require('../../utilities/customErrors');
const logger = require('../logger');

const client_credentials = `client=${process.env.SERVICE_NAME}&password=${process.env.CLIENT_SECRET}`;
let token = null;

const errorAnalisis = (err, msg) => {
    if (err.response) {
        logger.custom(new CustomError(msg, { status: err.response.status, body: err.response.data }));
    } else if (err.request) {
        logger.custom(new CustomError(msg, err.request));
    } else {
        logger.custom(new CustomError(msg, error.message));
    }
}

const getToken = async () => {
    if (token) {
        return token;
    }
    try {
        const res = await axios.get(`${process.env.AUTH_URL}/client_token?${client_credentials}`);
        setTimeout(() => { token = null; }, 29 * 60 * 1000);
        return res.data;
    } catch (err) {
        errorAnalisis(err, 'Не удалось получить client token');

        return null;
    }

}

const getUserByUserId = async (userid) => {
    try {
        const token = await getToken();
        if (!token) {
            return null;
        }
        const opt = {
            headers: {
                'Authorization': `Bearer ${token.token}`
            }
        }
        const res = await axios.get(`${process.env.PROFILES_URL}/?id=${userid}`, opt);
        return res.data;
    } catch (err) {
        errorAnalisis(err, 'Не удалось получить пользователя по userid');
        return null;
    }
}

module.exports = { getUserByUserId };