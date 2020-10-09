const Profiles = require('./model');

const create = async (user) => {
    return await Profiles.create(user);
}

const all = async (page, limit) => {
    return await Profiles.all(page, limit);
}

const byId = async (id) => {
    return await Profiles.byId(id);
}

const byUsername = async (username) => {
    return await Profiles.byUsername(username);
}

module.exports = { create, all, byId, byUsername };