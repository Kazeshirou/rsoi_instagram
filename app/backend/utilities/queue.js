const redis = require("async-redis");
const client = redis.createClient();


const push = async (key, val) => {
    await client.rpush(key, JSON.stringify(val));
}

const get = async (key) => {
    try {
        const { ids } = await client.lrange(key, 0, -1);
        client.del(key);
        return resolve(ids.map((id) => JSON.parse(id)));
    } catch (err) {
        throw err;
    }
}

module.exports = (injectedLogger) => {
    client.on("error", (err) => {
        injectedLogger.error(err);
    });

    return {
        push,
        get
    }
};