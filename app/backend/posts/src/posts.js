const Posts = require('./model');

const create = async (user) => {
    return await Posts.create(user);
}

const all = async (page, limit) => {
    return await Posts.all(page, limit);
}

const byId = async (id) => {
    return await Posts.byId(id);
}

const byUserId = async (userId) => {
    return await Posts.byUserId(userId);
}

module.exports = { create, all, byId, byUserId };