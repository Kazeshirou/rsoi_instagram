var path = require('path');
var Telescope = require(path.join(__dirname, 'model'));

 function all(limit, page) {
    return Telescope.all(limit, page);
}

 function count() {
    return Telescope.count();
}

 function byName(name) {
    return Telescope.findByName(name);
}

 function byId(id) {
    return Telescope.findById(id);
}

 function create(telescope) {
    return Telescope.createTelescope(telescope);
}

 function deleteById(id) {
    return Telescope.deleteTelescope(id);
}

 function updateByName(telescope) {
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