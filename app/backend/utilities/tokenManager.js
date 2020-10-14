const axios = require('axios');
const axiosErrorAnalizator = require('./axiosErrorAnalizator');

let logger;

class TokenManager {
    constructor() {
        this.client_credentials = `client=${process.env.SERVICE_NAME}&password=${process.env.CLIENT_SECRET}`;
        this.token = null;
    }

    getToken = async () => {
        if (this.token) {
            return this.token;
        }
        try {
            const res = await axios.get(`${process.env.AUTH_URL}/client_token?${this.client_credentials}`);
            setTimeout(() => { this.token = null; }, 29 * 60 * 1000);
            this.token = res.data.token;
            return this.token;
        } catch (err) {
            throw logger.custom(axiosErrorAnalizator('Не удалось получить client token', err));
        }
    }
}

module.exports = (injectedLogger) => {
    logger = injectedLogger;
    return TokenManager;
};