const { Sequelize, Model } = require('sequelize');
const db = require('../db.js');

class Marks extends Model { }

Marks.init({
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
}, { sequelize: db, timestamps: true, modelName: "Marks" });

const get = async (query) => {
    try {
        if (!query) {
            return await Marks.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
            });
        }
        const { where } = query;
        return await Marks.findAll({
            where,
            order: [
                ['createdAt', 'DESC']
            ],
        });
    } catch (err) {
        throw err;
    }
}

const create = async (mark) => {
    try {
        return await Marks.create(mark);
    } catch (err) {
        throw err;
    }
}

const deleteMark = async (query) => {
    try {
        const { where } = query;
        return await Marks.destroy({
            where
        });
    } catch (err) {
        throw err;
    }
}

module.exports = { create, get, deleteMark };