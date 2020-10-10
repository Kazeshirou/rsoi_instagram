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

const byUserId = async (userId) => {
    return await Profiles.byUserId(userId);
}

module.exports = { create, all, byId, byUserId };