const { Sequelize, Model, DataTypes } = require('sequelize');
const db = require('../db.js');

class Posts extends Model { }

Posts.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: Sequelize.STRING,
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

const get = async (query) => {
    try {
        if (!query) {
            return await Posts.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
            });
        }
        const { page, limit, where } = query;
        if (page && limit) {
            return await Posts.findAll({
                offset: page * limit,
                limit,
                where,
                order: [
                    ['createdAt', 'DESC']
                ],
            });
        } else {
            return await Posts.findAll({
                where,
                order: [
                    ['createdAt', 'DESC']
                ],
            });
        }
    } catch (err) {
        throw err;
    }
}

const create = async (post) => {
    try {
        return await Posts.create(post);
    } catch (err) {
        throw err;
    }
}

module.exports = { create, get };