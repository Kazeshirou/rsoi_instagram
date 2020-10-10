const { Sequelize, Model, DataTypes } = require('sequelize');
const logger = require('../logger');
const db = require('../db.js');

class Marks extends Model { }

Marks.init({
    userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: 'compositeIndex'
    },
    postId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: 'compositeIndex'
    }
}, { sequelize: db, timestamps: true, modelName: "Marks" });

const byUserId = async (userId) => {
    let res = {};
    try {
        res = await Marks.findAll({ where: { userId } });
        if (!res) {
            res = {};
        }
    } catch (err) {
        return err;
    }
    return res;
}

const byPostId = async (postId) => {
    let res = {};
    try {
        res = await Marks.findAll({ where: { postId } });
        if (!res) {
            res = {};
        }
    } catch (err) {
        return err;
    }
    return res;
}

const create = async (post) => {
    try {
        await Marks.create(post);
    } catch (err) {
        logger.error({ message: { info: 'Не удалось создать тег', error: err } });
        return false;
    }
    return true;
}

module.exports = { create, byUserId, byPostId };