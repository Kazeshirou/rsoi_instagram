var path = require('path');
var Telescope = require(path.join(__dirname, 'model'));

async function all(limit, page) {
    return Telescope.all(limit, page);
}

async function count() {
    return Telescope.count();
}

async function byName(name) {
    return Telescope.findByName(name);
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
    count,
    create,
    deleteByName,
    updateByName
};