var path = require('path');
var Sequelize = require('sequelize');
var Model = Sequelize.Model;
var db = require(path.join(__dirname, '../../db/'));

class Telescope extends Model { }

Telescope.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        unique: true
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
    },
}, { sequelize: db, timestamps: true, modelName: "Telescope" });

function createTelescope(telescope) {
    return new Promise((resolve, reject) => {
        Telescope.create(telescope)
            .then((telescope) => {
                resolve({ success: true, telescope: telescope });
            })
            .catch((err) => {
                resolve({ success: false, msg: err.original.detail });
            });
    });
}

function findByName(name) {
    return new Promise((resolve, reject) => {
        Telescope.findAll({
            where: {
                name: name
            }
        })
            .then((telescopes) => {
                if (telescopes.length == 1) {
                    resolve({
                        success: true,
                        telescope: telescopes[0]
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
        Telescope.findAll({
            where: {
                id: id
            }
        })
            .then((telescopes) => {
                if (telescopes.length == 1) {
                    resolve({
                        success: true,
                        telescope: telescopes[0]
                    });
                } else {
                    resolve({ success: false });
                }
            })
            .catch((err) => reject(err));
    });
}

function all(limit, page) {
    return new Promise((resolve, reject) => {
        Telescope.findAll({ offset: (page - 1) * limit, limit: limit })
            .then((telescopes) => { resolve(telescopes); })
            .catch((err) => reject(err));
    });
}

function count() {
    return new Promise((resolve, reject) => {
        Telescope.count()
            .then((count) => { resolve(count); })
            .catch((err) => reject(err));
    });
}

function deleteTelescope(id) {
    return new Promise((resolve, reject) => {
        Telescope.destroy({
            where: {
                id: id
            }
        })
            .then((telescope) => {
                if (telescope > 0) {
                    resolve({ success: true });
                } else {
                    resolve({ success: false });
                }
            })
            .catch((err) => reject(err));
    });
}

function updateTelescope(telescope) {
    return new Promise((resolve, reject) => {
        Telescope.update(telescope, { where: { name: telescope.name } })
            .then((telescope_num) => {
                resolve({ success: true, telescope_num: telescope_num });
            })
            .catch((err) => {
                resolve({ success: false, msg: err.original.detail });
            });
    });
}

module.exports = {
    createTelescope,
    deleteTelescope,
    updateTelescope,
    all,
    count,
    findByName,
    findById
};