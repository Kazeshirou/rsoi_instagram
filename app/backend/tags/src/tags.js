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

const byUsername = async (username) => {
    return await Tags.byUsername(username);
}

const byPostId = async (postId) => {
    return await Tags.byPostId(postId);
}

module.exports = { create, all, byValue, byUsername, byPostId };