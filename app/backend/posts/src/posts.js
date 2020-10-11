const Posts = require('./model');

const create = async (user) => {
    return await Posts.create(user);
}

const all = async (page, limit) => {
    const posts = await Posts.all(page, limit);
    console.log(posts);
    return posts;
}

const byId = async (id) => {
    return await Posts.byId(id);
}

const byUserId = async (userId) => {
    return await Posts.byUserId(userId);
}

module.exports = { create, all, byId, byUserId };