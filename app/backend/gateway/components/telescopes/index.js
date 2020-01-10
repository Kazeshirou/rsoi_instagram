var path = require('path');
var Telescope = require(path.join(__dirname, 'model'));

function all(page) {
    return Telescope.findAll(page);
}

function count() {
    return Telescope.count();
}

function byName(name) {
    return Telescope.findByName(name);
}

function create(telescope) {
    return Telescope.createTelescope(telescope);
}

function deleteByName(name) {
    return Telescope.deleteTelescope(name);
}

function updateByName(telescope) {
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