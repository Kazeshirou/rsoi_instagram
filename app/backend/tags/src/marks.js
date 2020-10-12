const Marks = require('./tagsModel');

const create = async (user) => {
    return await Marks.create(user);
}

const byUsername = async (username) => {
    return await Marks.byUserId(username);
}

const byPostId = async (userId) => {
    return await Marks.byPostId(userId);
}

module.exports = { create, byUsername, byPostId };