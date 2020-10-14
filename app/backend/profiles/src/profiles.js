const Profiles = require('./model');
const service = require('./service');

const create = async (user) => {
    return await Profiles.create(user);
}

const get = async (query) => {
    return await Profiles.get(query);
}

const update = async (id, user) => {
    return await Profiles.update(id, user);
}

const friends = async (query) => {
    return await Profiles.friends(query);
}

const addFriend = async (id, friendId) => {
    return await Profiles.addFriend(id, friendId);
}

module.exports = { create, get, friends, addFriend, update };