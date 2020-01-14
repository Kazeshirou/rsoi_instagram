var path = require('path');
var config = require(path.join(__dirname, '../../config/', (process.env.NODE_ENV || 'development')));
var http = require('http');

var opt = {
    host: '127.0.0.1',
    port: config.telescopes.port,
    agent: false,
    headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    }
}

function http_request(opt, resolve, reject, request_data) {
    var req = http.request(opt, (res) => {
        var body = [];

        res.on('data', (chunk) => {
            body.push(chunk);
        });

        res.on('end', () => {
            try {
                if (body.length)
                    body = JSON.parse(Buffer.concat(body).toString());
            } catch (e) {
                reject(e);
            }

            res.body = body;
            resolve(res);
        });
    });

    req.on('error', (err) => {
        var res = {
            statusCode : 424,
            body: {
                err: {
                    message: "Failed Dependency"
                }
            }
        }
        resolve(res);
    });

    if (request_data) {
        req.write(JSON.stringify(request_data));
    }

    req.end();
}

function createTelescope(telescope) {
    return new Promise((resolve, reject) => {
        opt.method = 'POST';
        opt.path = '/api/v1/';
        http_request(opt, resolve, reject, telescope);
    });
}

function findByName(name) {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/v1/' + name;
        http_request(opt, resolve, reject);
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/v1/id/' + id;
        http_request(opt, resolve, reject);
    });
}

function findAll(page) {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/v1/?page=' + page.page + '&limit=' + page.limit;
        http_request(opt, resolve, reject);
    });
}

function count() {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/v1/count';
        http_request(opt, resolve, reject);
    });
}

function deleteTelescope(id) {
    return new Promise((resolve, reject) => {
        opt.method = 'DELETE';
        opt.path = '/api/v1/' + id;
        http_request(opt, resolve, reject);
    });
}

function updateTelescope(telescope) {
    return new Promise((resolve, reject) => {
        opt.method = 'PUT';
        opt.path = '/api/v1/';
        http_request(opt, resolve, reject, telescope);
    });
}

module.exports = {
    createTelescope,
    deleteTelescope,
    updateTelescope,
    findAll,
    count,
    findByName,
    findById
};