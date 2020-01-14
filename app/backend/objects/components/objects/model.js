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
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    coord2: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    coord3: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
}, { sequelize: db, timestamps: true, modelName: "Object" });

 function createObject(object) {
    return new Promise((resolve, reject) => {
        Object.create(object)
            .then((object) => {
                resolve({ success: true, object: object });
            })
            .catch((err) => {
                resolve({ success: false, msg: err.original.detail });
            });
    });
}

 function findByName(name) {
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
            .catch((err) => reject(err));
    });
}

 function findById(id) {
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

 function all(limit, page) {
    return new Promise((resolve, reject) => {
        Object.findAll({ offset: (page - 1) * limit, limit: limit })
            .then((objects) => { resolve(objects); })
            .catch((err) => reject(err));
    });
}

 function count() {
    return new Promise((resolve, reject) => {
        Object.count()
            .then((count) => { resolve(count); })
            .catch((err) => reject(err));
    });
}

 function deleteObject(id) {
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
            })
            .catch((err) => reject(err));
    });
}

 function updateObject(object) {
    return new Promise((resolve, reject) => {
        Object.update(object, { where: { name: object.name } })
            .then((object_num) => {
                resolve({ success: true, object_num: object_num });
            })
            .catch((err) => {
                resolve({ success: false, msg: err.original.detail });
            })
            .catch((err) => reject(err));
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