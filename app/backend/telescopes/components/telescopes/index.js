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

async function byId(id) {
    return Telescope.findById(id);
}

async function create(telescope) {
    return Telescope.createTelescope(telescope);
}

async function deleteById(id) {
    return Telescope.deleteTelescope(id);
}

async function updateByName(telescope) {
    return Telescope.updateTelescope(telescope);
}

module.exports = {
    all,
    byName,
    byId,
    count,
    create,
    deleteById,
    updateByName
};