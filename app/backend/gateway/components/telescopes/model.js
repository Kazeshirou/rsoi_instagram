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
            console.log(res)
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

    req.on('error', function (err) {
        reject(err);
    });

    if (request_data) {
        req.write(JSON.stringify(request_data));
    }

    req.end();
}

async function createTelescope(telescope) {
    return new Promise((resolve, reject) => {
        opt.method = 'POST';
        opt.path = '/api/';
        http_request(opt, resolve, reject, telescope);
    });
}

async function findByName(name) {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/' + name;
        http_request(opt, resolve, reject);
    });
}

async function findAll(page) {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/?page=' + page.page + '&limit=' + page.limit;
        http_request(opt, resolve, reject);
    });
}

async function count() {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/count';
        http_request(opt, resolve, reject);
    });
}

async function deleteTelescope(name) {
    return new Promise((resolve, reject) => {
        opt.method = 'DELETE';
        opt.path = '/api/' + name;
        http_request(opt, resolve, reject);
    });
}

async function updateTelescope(telescope) {
    return new Promise((resolve, reject) => {
        opt.method = 'PUT';
        opt.path = '/api/';
        http_request(opt, resolve, reject, telescope);
    });
}

module.exports = {
    createTelescope,
    deleteTelescope,
    updateTelescope,
    findAll,
    count,
    findByName
};