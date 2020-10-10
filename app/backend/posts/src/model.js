const { Sequelize, Model, DataTypes } = require('sequelize');
const logger = require('../logger');
const db = require('../db.js');

class Posts extends Model { }

Posts.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    src: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
}, { sequelize: db, timestamps: true, modelName: "Posts" });


const byId = async (id) => {
    try {
        const res = await Posts.findOne({ where: { id } });
    } catch (err) {
        throw Error(`Не удалось найти пост с id = ${id}`);
    }
}

const byUserId = async (userId) => {
    let res = {};
    try {
        res = await Posts.findAll({ where: { userId } });
        if (!res) {
            res = {};
        }
    } catch (err) {
    }
    return res;
}

const all = async (page, limit) => {
    let res = {};
    try {
        if (page && limit) {
            res = await Posts.findAll({ offset: page * limit, limit });
        } else {
            res = await Posts.findAll();
        }
    } catch (err) {
        return err;
    }

    return res;
}

const create = async (post) => {
    try {
        await Posts.create(post);
    } catch (err) {
        logger.error({ message: { info: 'Не удалось создать пост', error: err } });
        return false;
    }
    return true;
}

module.exports = { create, all, byId, byUserId };