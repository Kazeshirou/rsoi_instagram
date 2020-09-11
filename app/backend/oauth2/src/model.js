const path = require('path');
const { Sequelize, Model, DataTypes } = require('sequelize');
const db = require('../db.js');

class Users extends Model { }

Users.init({
    profileId: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
}, { sequelize: db, timestamps: true, modelName: "Users" });


const byUsername = async (username) => {
    let res = {};
    try {
        res = await Users.findOne({ where: { username } });
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

module.exports = { create, byUsername };