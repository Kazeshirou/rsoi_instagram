const Tags = require('./tagsModel');

const create = async (tags) => {
    return await Tags.create(tags);
}

const get = async (query) => {
    try {
        return await Tags.get(query);
    } catch (err) {
        throw err;
    }
}

module.exports = { create, get };