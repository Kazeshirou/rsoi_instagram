const Posts = require('./model');
const service = require('./service');

const create = async (post) => {
    return await Posts.create(post);
}

const get = async (query) => {
    let posts;

    try {
        posts = await Posts.get(query);
    } catch (err) {
        throw err;
    }

    if (posts.length === 0) {
        return posts
    }

    const promises = posts.map((post) => { return new Promise(async (res) => res(await service.getUserByUserId(post.userId))) });
    const users = await Promise.all(promises);
    return posts.map((post, i) => {
        if (!users[i]) {
            return post;
        }

        const { username, profileImg } = users[i].profiles[0];
        post.dataValues.username = username;
        post.dataValues.profileImg = profileImg;
        return post;
    });
}

module.exports = { create, get };