const Posts = require('./model');

const create = async (user) => {
    return await Posts.create(user);
}

const all = async (page, limit) => {
    const posts = await Posts.all(page, limit);
    return posts;
}

const byId = async (id) => {
    return await Posts.byId(id);
}

const byUserId = async (userId, page, limit) => {
    return await Posts.byUserId(userId, page, limit);
}

module.exports = { create, all, byId, byUserId };