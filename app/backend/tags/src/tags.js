const Tags = require('./tagsModel');

const create = async (user) => {
    return await Tags.create(user);
}

const all = async (page, limit) => {
    return await Tags.all(page, limit);
}

const byValue = async (value) => {
    return await Tags.byValue(value);
}

const byUserId = async (userId) => {
    return await Tags.byUserId(userId);
}

const byPostId = async (userId) => {
    return await Tags.byPostId(userId);
}

module.exports = { create, all, byValue, byUserId, byPostId };