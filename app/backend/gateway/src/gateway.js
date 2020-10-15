const service = require('./service');

const getUserById = async (userId) => {
    try {
        const res = await service.getUserByUserId(userId);
        return res.profiles[0];
    } catch (err) {
        throw err;
    }
}

const getTagsByPostId = async (postId) => {
    try {
        return await service.getTagsByPostId(postId);
    } catch (err) {
        throw err;
    }
}

module.exports = { getUserById, getTagsByPostId };