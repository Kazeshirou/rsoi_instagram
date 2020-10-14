const axios = require('axios');
const logger = require('../logger');
const request = require('../../utilities/request')(logger);
const { CustomError } = require('../../utilities/customErrors');

const createProfile = async (user) => {
    try {
        const req = async (body, opt) => {
            return await axios.post(`${process.env.PROFILES_URL}/`, body, opt);
        }
        const res = await request.post(req, user, 'Не удалось создать профиль пользователя');
        return res;
    } catch (err) {
        if (err instanceof CustomError) {
            throw err;
        }
        throw logger.custom(new CustomError('Неожиданная ошибка при создании профиля пользователя', err));
    }
}

module.exports = { createProfile };