var oauth2orize = require('oauth2orize')
var Client = require('../models/client');
var Token = require('../models/token');
var Code = require('../models/code');

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

server.serializeClient((client, callback) => {
    return callback(null, client._id);
});

server.deserializeClient((id, callback) => {
    Client.findOne({ _id: id }, (err, client) => {
        if (err) {
            return callback(err);
        }
        return callback(null, client);
    });
});


server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, callback) {
    var code = new Code({
        value: uid(16),
        clientId: client._id,
        redirectUri: redirectUri,
        userId: user._id,
        username: user.username
    });

    code.save(err => {
        if (err) {
            return callback(err);
        }

        callback(null, code.value);
    });
}));

server.exchange(oauth2orize.exchange.code((client, code, redirectUri, callback) => {
    Code.findOne({ value: code }, (err, authCode) => {
        if (err) {
            return callback(err);
        }
        if (authCode === undefined) {
            return callback(null, false);
        }
        
        if (!authCode || client._id.toString() !== authCode.clientId) {
            return callback(null, false);
        }
        if (redirectUri !== authCode.redirectUri) {
            console.log(redirectUri, authCode.redirectUri)
            return callback(null, false);
        }

        authCode.remove((err) => {
            if (err) {
                return callback(err);
            }

            var token = new Token({
                value: uid(256),
                clientId: authCode.clientId,
                userId: authCode.userId,
                username: authCode.username,
                expiration: Date.now() + 0.5*60*1e3, // 30 минут
                refreshToken: uid(256),
                refreshTokenExpiration: Date.now() + 30*24*60*60*1e3 // 30 дней
            });

            token.save(function (err) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }
                console.log(token);
                callback(null, token);
            });
        });
    });
}));


exports.authorization = [
    server.authorization((clientId, redirectUri, callback) => {

        Client.findOne({ id: clientId }, (err, client) => {
            if (err) { return callback(err); }

            return callback(null, client, redirectUri);
        });
    }),
    function (req, res) {
        res.render('dialog', { sessionID: req.sessionID, transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    }
]

exports.decision = [
    (req, res, next) => {
        req.sessionID = req.body.sessionID;
        req.session.authorize = JSON.parse(req.sessionStore.sessions[req.sessionID]).authorize;

        next()
    },
    server.decision()
]

exports.refreshToken = [
    (req, res) => {
        Token.findOne({ refreshToken: req.body.refresh }, (err, token) => {
            if (err) {
                return res.status(401).end();
            }

            if (token.refreshTokenExpiration <= Date.now()) {
                return res.status(401).end();
            } 
            token.expiration = Date.now() + 0.5 * 60 * 1e3;
            token.value = uid(256);
            token.refreshToken = uid(256);
            Token.updateOne({ _id: token._id }, { expiration: token.expiration, value: token.value, refreshToken: token.refreshToken  }, (err, result) => {
                if (err) {
                    return res.status(401).end();
                } 

                if (result.nModified === 1) {
                    return res.json(token);
                }
                return res.status(401).end();
            })
        })
    }
]

exports.token = [
    server.token(),
    server.errorHandler()
]

function uid(len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

