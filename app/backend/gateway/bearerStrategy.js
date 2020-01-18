var passport = require('passport');
var Strategy = require('passport-http-bearer').Strategy;
var path = require('path');
var config = require(path.join(__dirname, './config/', (process.env.NODE_ENV || 'development')));
var http = require('http');

var opt = {
    host: '127.0.0.1',
    port: config.auth.port,
    agent: false,
    headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    }
}

function httpRequest(opt, resolve, reject, request_data) {
    var req = http.request(opt, (res) => {
        var body = [];

        res.on('data', (chunk) => {
            body.push(chunk);
        });

        res.on('end', () => {
            try {
                if (body.length) {
                    console.log(Buffer.concat(body).toString())
                    body = JSON.parse(Buffer.concat(body).toString());
                }
            } catch (err) {
                if (res.statusCode == 401) {
                    return resolve(res);
                }
                let error = {
                    statusCode: 424,
                    body: {
                        err: {
                            message: "Ошибка парсинга тела ответа от auth.",
                            detail: err
                        }
                    }
                }
                reject(error);
            }

            res.body = body;
            resolve(res);
        });
    });

    req.on('error', (err) => {
        let error = {
            statusCode: 424,
            body: {
                err: {
                    message: "auth не отвечает.",
                    detail: err
                }
            }
        }
        reject(error);
    });

    if (request_data) {
        req.write(JSON.stringify(request_data));
    }

    req.end();
}

function checkToken(token) {
    return new Promise((resolve, reject) => {
        opt.method = "GET";
        opt.path = '/api/v1/';
        opt.headers["Authorization"] = "Bearer " + token;
        httpRequest(opt, resolve, reject);
    });
}

function getToken(code) {
    return new Promise((resolve, reject) => {
        opt.method = "POST";
        opt.path = '/api/v1/oauth2/token';
        httpRequest(opt, resolve, reject, { client_id: 'telescopes', client_secret: '654321', grant_type: 'authorization_code', code: code, redirect_uri: 'http://localhost:49001/api/v1/code'});
    });
}

passport.use(new Strategy(
    (token, done) => {
        checkToken(token)
            .then(res => {
                if (!res) {
                    return done(null, false);
                }

                if (res.statusCode != 200) {
                    return done(null, false);
                }
                return done(null, res, { scope: '*' });
            })
            .catch(err => {
                return done(err);
            });
    })
);

module.exports = {
    isAuthenticated: passport.authenticate('bearer', { session: false, failureRedirect: `http://127.0.0.1:${config.auth.port}/api/v1/oauth2/authorize?client_id=telescopes&response_type=code&redirect_uri=http://localhost:49001/api/v1/code` }),
    getToken
}