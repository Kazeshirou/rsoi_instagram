const { Sequelize, Model, DataTypes } = require('sequelize');
const logger = require('../logger');
const { CustomError, ValidationError, NotFoundError } = require('../../utilities/customErrors');
const db = require('../db.js');

class Clients extends Model { }

Clients.init({
    client: {
        type: DataTypes.STRING,
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
    }
}, { sequelize: db, timestamps: true, modelName: "Clients" });

const byClient = async (client) => {
    if (!client) {
        const error = new CustomError('Не удалось найти клиента.', { client: 'Не задан.' });
        throw logger.custom(error);
    }
    try {
        return await Clients.findOne({ where: { client } });
    } catch (err) {
        const error = new CustomError('Не удалось найти клиента.', err);
        throw logger.custom(error);
    }
}

const create = async (clientData) => {
    try {
        return await Clients.create(clientData);
    } catch (err) {
        if (err.original.constraint === 'Clients_pkey') {
            const error = new ValidationError('Не удалось зарегистрировать клиента.', {
                client: 'Клиент с таким именем уже существует.'
            });
            throw logger.custom(error);
        }
        const error = new CustomError('Не удалось зарегистрировать клиента.', 'Ошибка сервера. Попробуйте позже.');
        throw logger.custom(error);
    }
}

module.exports = { create, byClient };