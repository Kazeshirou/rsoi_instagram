var path = require('path');
var config = require(path.join(__dirname, '../../config/', (process.env.NODE_ENV || 'development')));
var http = require('http');

var opt = {
    host: '127.0.0.1',
    port: config.objects.port,
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

async function createObject(object) {
    return new Promise((resolve, reject) => {
        opt.method = 'POST';
        opt.path = '/api/v1/';
        http_request(opt, resolve, reject, object);
    });
}

async function findByName(name) {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/v1/' + name;
        http_request(opt, resolve, reject);
    });
}

async function findAll(page) {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/v1/?page=' + page.page + '&limit=' + page.limit;
        http_request(opt, resolve, reject);
    });
}

async function count() {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/v1/count';
        http_request(opt, resolve, reject);
    });
}

async function deleteObject(name) {
    return new Promise((resolve, reject) => {
        opt.method = 'DELETE';
        opt.path = '/api/v1/' + name;
        http_request(opt, resolve, reject);
    });
}

async function updateObject(object) {
    return new Promise((resolve, reject) => {
        opt.method = 'PUT';
        opt.path = '/api/v1/';
        http_request(opt, resolve, reject, object);
    });
}

module.exports = {
    createObject,
    deleteObject,
    updateObject,
    findAll,
    count,
    findByName
};