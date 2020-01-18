var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var ClientStrategy = require('passport-oauth2-client-password').Strategy;
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');

passport.use(new BasicStrategy(
    (username, password, callback) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) {
                return callback(err);
            }

            if (!user) {
                return callback(null, false);
            }

            user.verifyPassword(password, (err, isMatch) => {
                if (err) {
                    return callback(err);
                }

                if (!isMatch) {
                    return callback(null, false);
                }

                return callback(null, user);
            });
        });
    }
));

passport.use(new ClientStrategy(
    (clientId, clientSecret, callback) => {
        Client.findOne({ id: clientId }, (err, client) => {
            if (err) {
                return callback(err);
            }

            if (!client || client.secret !== clientSecret) {
                return callback(null, false);
            }
            return callback(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    (accessToken, callback) => {
        console.log(accessToken)
        Token.findOne({ value: accessToken }, (err, token) => {
            if (err) {
                return callback(err);
            }

            if (!token) { return callback(null, false); }
            console.log("Token founded")
            if (token.expiration <= Date.now()) {
                console.log("Token expirated")
                return callback(null, false);
            }

            User.findOne({ _id: token.userId }, (err, user) => {
                if (err) { return callback(err); }

                if (!user) { return callback(null, false); }

                callback(null, user, { scope: '*' });
            });
        });
    }
));

module.exports = {
    isAuthenticated: passport.authenticate('basic', { session: false }),
    isClientAuthenticated: passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    isBearerAuthenticated: passport.authenticate('bearer', { session: false})
};









