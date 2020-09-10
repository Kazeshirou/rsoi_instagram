const path = require('path');
const { Sequelize, Model, DataTypes } = require('sequelize');
const db = require('../db.js');

class Users extends Model { }

Users.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        unique: true
    },
    profileImg: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    age: {
        type: Sequelize.STRING,
        validate: {
            max: 150,
            min: 0
        },
    },
}, { sequelize: db, timestamps: true, modelName: "Users" });


const byId = async (id) => {
    let res = {};
    try {
        res = await Users.findOne({ where: { id: id } });
    } catch (err) {
        return err;
    }

    return res;
}

const all = async (page, limit) => {
    let res = {};
    try {
        res = await Users.findAll({ offset: page * limit, limit: limit });
    } catch (err) {
        return err;
    }

    return res;
}

const create = async (user) => {
    let res = {};
    try {
        res = await Users.create(user);
    } catch (err) {
        return err;
    }

    return res;
}

module.exports = { create, all, byId };