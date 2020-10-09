const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const axios = require('axios');

let logger;

const checkAuth = async (token) => {
    const opt = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    try {
        const res = await axios.get(`${process.env.AUTH_URL}/auth/`, opt);
        return res.data;
    } catch (err) {
        if (err.response) {
            logger.error({ message: { info: 'Аутентификация провалилась', status: err.response.status, body: err.response.data } });
        } else if (err.request) {
            logger.error({ message: { info: 'Аутентификация провалилась', request: err.request } });
        } else {
            logger.error({ message: { info: 'Аутентификация провалилась', error: error.message } });
        }

        return false;
    }
};

passport.use(new BearerStrategy(
    async (accessToken, callback) => {
        try {
            const isAuth = await checkAuth(accessToken);
            if (isAuth) {
                return callback(null, isAuth, { scope: '*' });
            }
            return callback(null, false);
        } catch (err) {
            logger.error({ message: err });
            return callback(null, false);
        }
    }
));

module.exports = (injectLogger) => { logger = injectLogger; return { auth: passport.authenticate('bearer', { session: false }) } };