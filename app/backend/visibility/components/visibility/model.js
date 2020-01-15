var path = require('path');
var Sequelize = require('sequelize');
var Model = Sequelize.Model;
var db = require(path.join(__dirname, '../../db/'));

class Visibility extends Model { }

Visibility.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    telescopeid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'compositeIndex',
        validate: { min: 1}
    },
    objectid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'compositeIndex',
        validate: { min: 1 }
    }

}, { sequelize: db, timestamps: true, modelName: "Visibility" });

function createVisibility(visibility) {
    return new Promise((resolve, reject) => {
        Visibility.create(visibility)
            .then((visibility) => {
                resolve({ success: true, visibility: visibility });
            })
            .catch((err) => {
                resolve({ success: false, msg: err.original.detail });
            });
    });
}

function all(limit, page) {
    return new Promise((resolve, reject) => {
        Visibility.findAll({ offset: page * limit, limit: limit })
            .then((visibility) => { resolve(visibility); })
            .catch ((err) => reject(err));
    });
}

function count() {
    return new Promise((resolve, reject) => {
        Visibility.count()
            .then((count) => { resolve(count); })
            .catch((err) => reject(err));
    });
}

function deleteVisibility(id) {
    return new Promise((resolve, reject) => {
        Visibility.destroy({
            where: {
                id: id
            }
        })
            .then((visibility) => {
                if (visibility > 0) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            })
            .catch((err) => reject(err));
    });
}

function deleteVisibilityByTelescopeid(id) {
    return new Promise((resolve, reject) => {
        Visibility.destroy({
            where: {
                telescopeid: id
            }
        })
            .then((visibility) => {
                if (visibility > 0) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            })
            .catch((err) => reject(err));
    });
}

function deleteVisibilityByObjectid(id) {
    return new Promise((resolve, reject) => {
        Visibility.destroy({
            where: {
                objectid: id
            }
        })
            .then((visibility) => {
                if (visibility > 0) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            })
            .catch((err) => reject(err));
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        Visibility.findAll({
            where: {
                id: id
            }
        })
            .then((visibility) => {
                if (visibility.length == 1) {
                    resolve({
                        success: true,
                        visibility: visibility[0]
                    });
                } else {
                    resolve({ success: false });
                }
            })
            .catch((err) => reject(err));
    });
}

module.exports = {
    createVisibility,
    deleteVisibility,
    deleteVisibilityByObjectid,
    deleteVisibilityByTelescopeid,
    all,
    count,
    findById
};