const { Sequelize, Model, ValidationError, DataTypes } = require('sequelize');
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
        type: DataTypes.STRING,
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
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, { sequelize: db, timestamps: true, modelName: "Users" });


const byUsername = async (username) => {
    try {
        return await Users.findOne({ where: { username } });
    } catch (err) {
        return null;
    }
}

const create = async (user) => {
    try {
        await Users.create(user);
    } catch (err) {
        let res = { statusCode: 400, msg: "Ошибки валидации", errors: {} }
        if (err.original.constraint === 'Users_username_key') {
            res.errors = {
                username: 'Пользователь с таким логином уже существует.'
            };
        } else if (err.original.constraint === 'Users_email_key') {
            res.errors = {
                email: 'Почта уже привязана к другому пользователю.'
            };
        } else {
            logger.error(err);
            res.msg = 'Не удалось зарегистрировать пользователя. Попробуйте позже.';
            res.errors = {};
        }
        return res;

    }

    return { msg: `Пользователь ${user.username} успешно зарегистрирован` };
}

module.exports = { create, byUsername };