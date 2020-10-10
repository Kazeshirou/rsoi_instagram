const Marks = require('./tagsModel');

const create = async (user) => {
    return await Marks.create(user);
}

const byUserId = async (userId) => {
    return await Marks.byUserId(userId);
}

const byPostId = async (userId) => {
    return await Marks.byPostId(userId);
}

module.exports = { create, byUserId, byPostId };