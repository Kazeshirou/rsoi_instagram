const axios = require('axios');
const logger = require('../logger');
const request = require('../../utilities/request')(logger);
const { CustomError } = require('../../utilities/customErrors');

const getUserByUserId = async (userId) => {
    try {
        const req = async (opt) => {
            return await axios.get(`${process.env.PROFILES_URL}/?id=${userId}`, opt);
        }
        const res = await request.get(req, 'Не удалось получить пользователя по userId');
        return res;
    } catch (err) {
        if (err instanceof CustomError) {
            return null;
        }
        logger.custom(new CustomError('Неожиданная ошибка при получении пользователя по userId', err));
        return null;
    }
}

const getTagsByPostId = async (postId) => {
    try {
        const req = async (opt) => {
            return await axios.get(`${process.env.TAGS_URL}/?postId=${postId}`, opt);
        }
        const res = await request.get(req, 'Не удалось получить теги и оценки по postId');
        return res;
    } catch (err) {
        if (err instanceof CustomError) {
            return null;
        }
        logger.custom(new CustomError('Неожиданная ошибка при получении тегов и оценок по postId', err));
        return null;
    }
}

module.exports = { getUserByUserId, getTagsByPostId };