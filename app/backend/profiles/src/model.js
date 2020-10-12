const { Sequelize, Model, DataTypes } = require('sequelize');
const db = require('../db.js');
const logger = require('../logger.js')

class Profiles extends Model { }

Profiles.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    profileImg: {
        type: Sequelize.STRING,
        defaultValue: `${process.env.USER_IMG_URL}/default.png`,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    age: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            max: 150,
            min: 0
        }
    },
    bio: {
        type: Sequelize.STRING,
        allowNull: true
    },
}, { sequelize: db, timestamps: true, modelName: "Profiles" });

Profiles.belongsToMany(Profiles, { as: 'friend', foreignKey: 'friendId', through: 'Friends' });
Profiles.belongsToMany(Profiles, { as: 'user', foreignKey: 'userId', through: 'Friends' });

const byId = async (id) => {
    let res = {};
    try {
        res = await Profiles.findOne({ where: { id } });
    } catch (err) {
        return err;
    }

    return res;
}

const byUsername = async (username) => {
    let res = {};
    try {
        res = await Profiles.findOne({ where: { username } });
        await res.addFriend({ where: { username: 'admin' } });
        if (!res) {
            res = {};
        }
    } catch (err) {
        return err;
    }
    return res;
}

const all = async (query) => {
    let res = {};
    const { page, limit, username, id } = query;
    let where = {};
    if (username) {
        where.username = username;
    } else if (id) {
        where.id = id;
    }

    try {
        if (page && limit) {
            res = await Profiles.findAll({ offset: page * limit, limit, where });
        } else {
            res = await Profiles.findAll({ where });
        }
    } catch (err) {
        return err;
    }

    return res;
}

const create = async (user) => {
    try {
        await Profiles.create(user);
    } catch (err) {
        logger.error({ message: { info: 'Не удалось создать профиль пользователя', error: err } });
        return false;
    }
    return true;
}

const friends = async ({ page, limit, username }) => {
    let res = {};
    try {
        res = await Profiles.findOne({ where: { username } });

        if (page && limit) {
            return await res.getFriend({ offset: page * limit, limit });
        }
        return await res.getFriends();

    } catch (err) {
        return err;
    }
    return res;
}

const addFriend = async ({ username, friendUsername }) => {
    const res = await Profiles.findOne({ where: { username } });
    const friend = await Profiles.findOne({ where: { username: friendUsername } });
    res.addFriend(friend);
}

module.exports = { create, all, byId, byUsername, friends, addFriend };