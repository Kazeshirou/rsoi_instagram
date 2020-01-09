var path = require('path');
var Telescope = require(path.join(__dirname, 'model'));

async function all() {
    return Telescope.findAll();
}

async function byName(name) {
    return Telescope.findAll(name);
}

async function create(telescope) {
    return Telescope.createTelescope(telescope);
}

async function deleteByName(name) {
    return Telescope.deleteTelescope(name);
}

async function updateByName(telescope) {
    return Telescope.updateTelescope(telescope);
}

module.exports = {
    all,
    byName,
    create,
    deleteByName,
    updateByName
};