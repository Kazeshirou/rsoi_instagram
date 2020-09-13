const { Sequelize, Model, DataTypes } = require('sequelize');
const logger = require('../logger');
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
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
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
    try {
        await Users.create(user);
    } catch (err) {
        logger.error(err)
        let res = { statusCode: 400, msg: "Ошибки валидации", errors: { username: "Пользователь с таким ником уже существует" } }
        return res;
    }

    return { msg: `Пользователь ${user.username} успешно зарегистрирован` };
}

module.exports = { create, byUsername };