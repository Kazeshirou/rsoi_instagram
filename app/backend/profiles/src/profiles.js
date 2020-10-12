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

const friends = async (query) => {
    return await Profiles.friends(query);
}

const addFriend = async (query) => {
    return await Profiles.addFriend(query);
}

module.exports = { create, all, full, friends, addFriend };