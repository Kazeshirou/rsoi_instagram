var path = require('path');
var config = require(path.join(__dirname, '../../config/', (process.env.NODE_ENV || 'development')));
var http = require('http');
var CircuitBreaker = require(path.join(__dirname, "../../utilities/circuitBreaker"))

var objectsCircuitBreaker = new CircuitBreaker(5, 10000, "Objects");

var opt = {
    host: '127.0.0.1',
    port: config.objects.port,
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
                if (body.length)
                    body = JSON.parse(Buffer.concat(body).toString());
            } catch (err) {
                let error = {
                    statusCode: 424,
                    body: {
                        err: {
                            message: "Ошибка парсинга тела ответа от Objects.",
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
            statusCode : 424,
            body: {
                err: {
                    message: "Objects не отвечает.",
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

function httpRequestWithCircuitBreaker(opt, resolve, reject, object) {
    return objectsCircuitBreaker.call(res => { objectsCircuitBreaker.log(); resolve(res) },
        err => { objectsCircuitBreaker.log(); reject(err)}, () => new Promise((res, rej) => httpRequest(opt, res, rej, object)));
}

function createObject(object) {
    return new Promise((resolve, reject) => {
        opt.method = 'POST';
        opt.path = '/api/v1/';
        httpRequestWithCircuitBreaker(opt, resolve, reject, object);
    });
}

function findByName(name) {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = encodeURI('/api/v1/' + name);
        httpRequestWithCircuitBreaker(opt, resolve, reject);
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/v1/id/' + id;
        httpRequestWithCircuitBreaker(opt, resolve, reject);
    });
}

function findAll(page) {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/v1/?page=' + page.page + '&limit=' + page.limit;
        httpRequestWithCircuitBreaker(opt, resolve, reject);
    });
}

function count() {
    return new Promise((resolve, reject) => {
        opt.method = 'GET';
        opt.path = '/api/v1/count';
        httpRequestWithCircuitBreaker(opt, resolve, reject);
    });
}

function deleteObject(id) {
    return new Promise((resolve, reject) => {
        opt.method = 'DELETE';
        opt.path = '/api/v1/' + id;
        httpRequestWithCircuitBreaker(opt, resolve, reject);
    });
}

function updateObject(object) {
    return new Promise((resolve, reject) => {
        opt.method = 'PUT';
        opt.path = '/api/v1/';
        httpRequestWithCircuitBreaker(opt, resolve, reject, object);
    });
}

module.exports = {
    createObject,
    deleteObject,
    updateObject,
    findAll,
    count,
    findByName,
    findById
};