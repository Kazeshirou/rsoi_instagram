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


const get = async (query) => {
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
        throw err;
    }

    return res;
}

const create = async (user) => {
    try {
        return await Profiles.create(user);
    } catch (err) {
        throw err
    }
}

const update = async (id, user) => {
    try {
        return await Profiles.update(user, { where: { id } });
    } catch (err) {
        throw err
    }
}

const friends = async ({ page, limit, username }) => {
    try {
        const res = await Profiles.findOne({ where: { username } });

        if (page && limit) {
            return await res.getFriend({ offset: page * limit, limit });
        }
        return await res.getFriend();

    } catch (err) {
        throw err;
    }
}

const addFriend = async (id, friendId) => {
    try {
        const res = await Profiles.findOne({ where: { id } });
        const friend = await Profiles.findOne({ where: { id: friendId } });
        res.addFriend(friend);
    } catch (err) {
        throw err;
    }
}

module.exports = { create, get, friends, addFriend, update };