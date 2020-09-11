const Users = require('./model');

const create = async (user) => {
    return await Users.create(user);
}

const all = async (page, limit) => {
    return await Users.all(page, limit);
}

const byId = async (id) => {
    return await Users.byId(id);
}

module.exports = { create, all, byId };