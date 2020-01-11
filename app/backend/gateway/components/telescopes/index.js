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

function byId(id) {
    return Telescope.findById(id);
}

function create(telescope) {
    return Telescope.createTelescope(telescope);
}

function deleteById(id) {
    return new Promise((resolve, reject) => {
        Telescope.deleteTelescope(id)
            .then(res => {
                var Visibility = require(path.join(__dirname, '../visibility'));
                Visibility.deleteByTelescopeid(id)
                    .then(res1 => {
                        resolve(res);
                    })
                    .catch(err => {
                        resolve(err);
                    })
            })
            .catch(err => {
                reject(err);
            })
    })
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