const Posts = require('./model');
const service = require('./service');

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

const byUsername = async (username, page, limit) => {
    const userId = await userIdByUsername(username);
    if (!userId) {
        return [];
    }
    return await Posts.byUserId(userId, page, limit);
}

const userIdByUsername = async (username) => {
    return await service.getUserByUsername(username);
}

module.exports = { create, all, byId, byUserId, byUsername };