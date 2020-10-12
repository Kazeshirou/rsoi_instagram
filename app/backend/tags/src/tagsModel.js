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
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        unique: 'compositeIndex'
    },
    postId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: 'compositeIndex'
    }
}, { sequelize: db, timestamps: true, modelName: "Tags" });


const byValue = async (value) => {
    let res = {};
    try {
        res = await Tags.findOne({ where: { value } });
    } catch (err) {
        return err;
    }

    return res;
}

const byUsername = async (username) => {
    let res = {};
    try {
        res = await Tags.findAll({ where: { username } });
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
        res = await Tags.findAll({ where: { postId } });
        if (!res) {
            res = {};
        }
    } catch (err) {
        return err;
    }
    return res;
}

const all = async () => {
    let res = {};
    try {
        res = Tags.aggregate('id', { plain: false, group: ['tags'] });
    } catch (err) {
        return err;
    }

    return res;
}

const create = async (post) => {
    try {
        await Tags.create(post);
    } catch (err) {
        logger.error({ message: { info: 'Не удалось создать тег', error: err } });
        return false;
    }
    return true;
}

module.exports = { create, all, byValue, byUsername, byPostId };