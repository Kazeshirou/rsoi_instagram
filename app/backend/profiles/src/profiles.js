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

const byUsername = async (username) => {
    return await Posts.byUsername(username);
}

module.exports = { create, all, byId, byUsername };