const axios = require('axios');
const axiosErrorAnalizator = require('../../utilities/axiosErrorAnalizator');
const logger = require('../logger');
const request = require('../../utilities/request')(logger);
const { CustomError } = require('../../utilities/customErrors');

const getUserByUserId = async (userid) => {
    try {
        const req = async (opt) => {
            return await axios.get(`${process.env.PROFILES_URL}/?id=${userid}`, opt);
        }
        const res = await request(req, 'Не удалось получить пользователя по userid');
        return res;
    } catch (err) {
        if (err instanceof CustomError) {
            return null;
        }
        logger.custom(new CustomError('Неожиданная ошибка при получении пользователя по userid', err));
        return null;
    }
}

const getPostMarkAndTag = async (postId) => {
    try {
        const token = await tokenManager.getToken();
        if (!token) {
            return null;
        }
        const opt = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        const res = await axios.get(`${process.env.PROFILES_URL}/?id=${userid}`, opt);
        return res.data;
    } catch (err) {
        if (err instanceof CustomError) {
            return null;
        }
        axiosErrorAnalizator('Не удалось получить пользователя по userid', err);
        return null;
    }
}

module.exports = { getUserByUserId };