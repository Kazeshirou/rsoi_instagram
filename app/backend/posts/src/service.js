const axios = require('axios');
const axiosErrorAnalizator = require('../../utilities/axiosErrorAnalizator');
const logger = require('../logger');
const TokenManager = require('../../utilities/tokenManager')(logger);
const { CustomError } = require('../../utilities/customErrors');

const tokenManager = new TokenManager;

const getUserByUserId = async (userid) => {
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