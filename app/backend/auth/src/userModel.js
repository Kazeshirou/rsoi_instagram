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
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, { sequelize: db, timestamps: true, modelName: "Users" });

const user = async (query) => {
    if (!query) {
        logger.custom_error('Не удалось найти пользователя.', 'Не заданы параметры поиска.');
        return null;
    }
    const { username, id } = query;
    try {
        if (id) {
            return await Users.findOne({ where: { id } });
        }
        if (username) {
            return await Users.findOne({ where: { username } });
        }
        logger.custom_error('Не удалось найти пользователя.', 'Параметры поиска некорректны.');
        return null;

    } catch (err) {
        logger.custom_error('Не удалось найти пользователя.', err);
        return null;
    }
}

const create = async (user) => {
    let res = {};
    try {
        res = await Users.create(user);
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

    return { msg: `Пользователь ${user.username} успешно зарегистрирован`, id: res.id };
}

const deleteById = async (id) => {
    try {
        await Users.destroy({ where: { id } });
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = { create, deleteById, user };