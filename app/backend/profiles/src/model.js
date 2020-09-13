const { Sequelize, Model, DataTypes } = require('sequelize');
const db = require('../db.js');

class Profiles extends Model { }

Profiles.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
            isEmail: true
        },
        unique: true
    },
    profileImg: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isUrl: true
        },
    },
    age: {
        type: Sequelize.STRING,
        validate: {
            max: 150,
            min: 0
        },
    },
}, { sequelize: db, timestamps: true, modelName: "Profiles" });


const byId = async (id) => {
    let res = {};
    try {
        res = await Profiles.findOne({ where: { id: id } });
    } catch (err) {
        return err;
    }

    return res;
}

const all = async (page, limit) => {
    let res = {};
    try {
        res = await Profiles.findAll({ offset: page * limit, limit: limit });
    } catch (err) {
        return err;
    }

    return res;
}

const create = async (user) => {
    let res = {};
    try {
        res = await Profiles.create(user);
    } catch (err) {
        return err;
    }

    return res;
}

module.exports = { create, all, byId };