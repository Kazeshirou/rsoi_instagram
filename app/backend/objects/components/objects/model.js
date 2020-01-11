var path = require('path');
var Sequelize = require('sequelize');
var Model = Sequelize.Model;
var db = require(path.join(__dirname, '../../db/'));

class Object extends Model { }

Object.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    coord1: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    coord2: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    coord3: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
}, { sequelize: db, timestamps: true, modelName: "Object" });

async function createObject(object) {
    return new Promise((resolve, reject) => {
        Object.create(object)
            .then((object) => {
                resolve({ success: true, object: object });
            })
            .catch((err) => {
                console.log(err);
                resolve({ success: false, msg: err.original.detail });
            });
    });
}

async function findByName(name) {
    return new Promise((resolve, reject) => {
        Object.findAll({
            where: {
                name: name
            }
        })
            .then((objects) => {
                if (objects.length == 1) {
                    resolve({
                        success: true,
                        object: objects[0]
                    });
                } else {
                    resolve({ success: false });
                }
            })
    });
}

async function findById(id) {
    return new Promise((resolve, reject) => {
        Object.findAll({
            where: {
                id: id
            }
        })
            .then((objects) => {
                if (objects.length == 1) {
                    resolve({
                        success: true,
                        object: objects[0]
                    });
                } else {
                    resolve({ success: false });
                }
            })
    });
}

async function all(limit, page) {
    return new Promise((resolve, reject) => {
        Object.findAll({ offset: (page - 1) * limit, limit: limit })
            .then((objects) => { resolve(objects); });
    });
}

async function count() {
    return new Promise((resolve, reject) => {
        Object.count()
            .then((count) => { resolve(count); });
    });
}

async function deleteObject(id) {
    return new Promise((resolve, reject) => {
        Object.destroy({
            where: {
                id: id
            }
        })
            .then((object) => {
                if (object > 0) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            });
    });
}

async function updateObject(object) {
    return new Promise((resolve, reject) => {
        Object.update(object, { where: { name: object.name } })
            .then((object_num) => {
                resolve({ success: true, object_num: object_num });
            })
            .catch((err) => {
                resolve({ success: false, msg: err.original.detail });
            });
    });
}

module.exports = {
    createObject,
    deleteObject,
    updateObject,
    all,
    count,
    findByName,
    findById
};