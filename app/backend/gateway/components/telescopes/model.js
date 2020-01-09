var path = require('path');
var Sequelize = require('sequelize');
var Model = Sequelize.Model;
var db = require(path.join(__dirname, '../../db/'));

class Telescope extends Model {}

Telescope.init({
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name : { 
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    type : {
        type: Sequelize.STRING,
        allowNull: false
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, { sequelize : db, timestamps : true, modelName : "Telescope" });

async function createTelescope(name, type, country, city) {
    return Telescope.create({name: name, type: type, country: country, city: city})
        .then((telescope) => { 
            return { success: true, telescope: telescope };
        })
        .catch((err) => {
            return { success: false, msg: err.original.detail };
        });
}

async function findAll(name) {
    if (name) {
        return Telescope.findAll({
            where: {
                name: name
            }
        })
            .then((telescopes) => {
                if (telescopes.length == 1) {
                    return { 
                        success: true, 
                        telescope: telescopes[0]
                    };
                } else {
                    return { success: false };
                } 
            })
    } else {
        return Telescope.findAll()
            .then((telescopes) => { return telescopes; });
    }
}

async function deleteTelescope(name) {
    return Telescope.destroy({
        where: {
            name: name
        }
    })
        .then((telescope) => { 
            if (telescope > 0) {
                return { success: true };
            } else {
                return { success: false };
            }
        });
}

async function updateTelescope(name, type, country, city) {
    return Telescope.update({ type: type, country: country, city: city }, { where: { name: name } })
        .then((telescope_num) => { 
            return { success: true, telescope_num: telescope_num };
        })
        .catch((err) => {
            return { success: false, msg: err.original.detail };
        });
}

module.exports = {
    createTelescope,
    deleteTelescope,
    updateTelescope,
    findAll
};