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
        unique: 'compositeIndex'
    },
    objectid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'compositeIndex'
    }

}, { sequelize: db, timestamps: true, modelName: "Visibility" });

async function createVisibility(visibility) {
    return new Promise((resolve, reject) => {
        Visibility.create(visibility)
            .then((visibility) => {
                resolve({ success: true, visibility: visibility });
            })
            .catch((err) => {
                console.log(err);
                resolve({ success: false, msg: err.original.detail });
            });
    });
}

async function all(limit, page) {
    return new Promise((resolve, reject) => {
        Visibility.findAll({ offset: (page - 1) * limit, limit: limit })
            .then((visibility) => { resolve(visibility); });
    });
}

async function count() {
    return new Promise((resolve, reject) => {
        Visibility.count()
            .then((count) => { resolve(count); });
    });
}

async function deleteVisibility(id) {
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
            });
    });
}

async function deleteVisibilityByTelescopeid(id) {
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
            });
    });
}

async function deleteVisibilityByObjectid(id) {
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
            });
    });
}

async function findById(id) {
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