var path = require('path');
var Telescope = require(path.join(__dirname, 'model'));

async function all() {
    return Telescope.findAll();
}

async function byName(name) {
    return Telescope.findAll(name);
}

async function create(name, type, country, city) {
    return Telescope.createTelescope(name, type, country, city);
}

async function deleteByName(name) {
    return Telescope.deleteTelescope(name);
}

async function updateByName(name, type, country, city) {
    return Telescope.updateTelescope(name, type, country, city);
}

module.exports = {
    all,
    byName,
    create,
    deleteByName,
    updateByName
};