const axiosErrorAnalizator = require('./axiosErrorAnalizator');
const { CustomError } = require('./customErrors');

let logger;

const request = async (req, errMsg) => {
    const TokenManager = require('./tokenManager')(logger);
    const tokenManager = new TokenManager;
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
        const res = await req(opt);
        return res.data;
    } catch (err) {
        if (err instanceof CustomError) {
            throw err;
        }
        throw logger.custom(axiosErrorAnalizator(errMsg, err));
    }
}

module.exports = (injectedLogger) => {
    logger = injectedLogger;
    return request;
};