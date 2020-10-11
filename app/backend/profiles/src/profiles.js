const Profiles = require('./model');
const service = require('./service');

const create = async (user) => {
    return await Profiles.create(user);
}

const all = async (query) => {
    return await Profiles.all(query);
}

const full = async (id) => {
    let userData = Promise.all(Profiles.byId(id), service.getUserByUserId(id))
    let user = await Profiles.byId(id);
    return
}

const byUsername = async (username) => {
    return await Profiles.byUsername(username);
}

module.exports = { create, all, full };