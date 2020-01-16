var logger = require('./logger');
var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
    logger.error(err);
});

function push(key, val) {
    return new Promise((resolve, reject) => {
        client.rpush(key, JSON.stringify(val), (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve();
        })
    });
}

function get(key) {
    return new Promise((resolve, reject) => {
        client.lrange(key, 0, -1, (err, ids) => {
            if (err) {
                return reject(err);
            }
            client.del(key);
            resolve(ids.map((id) => JSON.parse(id)));
        });
    });
}

module.exports = {
    push,
    get
};