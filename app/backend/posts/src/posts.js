const Posts = require('./model');
const service = require('./service');

const create = async (post) => {
    return await Posts.create(post);
}

const get = async (query, userId) => {
    let posts;

    try {
        posts = await Posts.get(query);
    } catch (err) {
        throw err;
    }

    if (posts.length === 0) {
        return posts
    }

    const usersPromises = posts.map((post) => { return new Promise(async (res) => res(await service.getUserByUserId(post.userId))) });
    const users = await Promise.all(usersPromises);
    const tagsPromises = posts.map((post) => { return new Promise(async (res) => res(await service.getTagsByPostId(post.id))) });
    const tagsAndMarks = await Promise.all(tagsPromises);
    return posts.map((post, i) => {
        if (users[i]) {
            const { username, profileImg } = users[i].profiles[0];
            post.dataValues.username = username;
            post.dataValues.profileImg = profileImg;
        }

        if (tagsAndMarks[i]) {
            const { tags, marks } = tagsAndMarks[i];
            post.dataValues.tags = tags;
            post.dataValues.marks = marks;
            post.dataValues.liked = false;
            if (marks) {
                if (marks.find((val) => { return val.userId === userId; })) {
                    post.dataValues.liked = true;
                }
            }

        }

        return post;
    });
}

module.exports = { create, get };