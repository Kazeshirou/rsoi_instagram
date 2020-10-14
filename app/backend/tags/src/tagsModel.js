const { Sequelize, Model, DataTypes } = require('sequelize');
const logger = require('../logger');
const db = require('../db.js');

class Tags extends Model { }

Tags.init({
    value: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'compositeIndex'
    },
    userId: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        unique: 'compositeIndex'
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    postId: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        unique: 'compositeIndex'
    }
}, { sequelize: db, timestamps: true, modelName: "Tags" });

const get = async (query) => {
    try {
        if (!query) {
            return await Tags.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
            });
        }
        const { where } = query;
        return await Tags.findAll({
            where,
            order: [
                ['createdAt', 'DESC']
            ],
        });
    } catch (err) {
        throw err;
    }
}

const create = async (tag) => {
    try {
        return await Tags.create(tag);
    } catch (err) {
        throw err;
    }
}

module.exports = { create, get };