var logger = require('./logger');
var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
    logger.error(err);
});

function set(name, key, val) {
    console.log("s")
    return new Promise((resolve, reject) => {
        client.hsetns(name, key, JSON.stringify(val), (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        })
    });
}

function get(name, key) {
    return new Promise((resolve, reject) => {
        client.hget(name, key, (err, val) => {
            if (err) {
                return reject(err);
            }
            client.del(key);
            resolve(JSON.parse(val));
        });
    });
}

module.exports = {
    set,
    get
};