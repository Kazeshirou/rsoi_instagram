var path = require('path');
var Visibility = require(path.join(__dirname, 'model'));

async function all(limit, page) {
    return Visibility.all(limit, page);
}

async function count() {
    return Visibility.count();
}

async function byId(id) {
    return Visibility.findById(id);
}

async function create(visibility) {
    return Visibility.createVisibility(visibility);
}

async function deleteById(id) {
    return Visibility.deleteVisibility(id);
}

async function deleteByTelescopeid(id) {
    return Visibility.deleteVisibilityByTelescopeid(id);
}

async function deleteByObjectid(id) {
    return Visibility.deleteVisibilityByObjectid(id);
}

async function deleteById(id) {
    return Visibility.deleteVisibility(id);
}

module.exports = {
    all,
    byId,
    count,
    create,
    deleteById,
    deleteByObjectid,
    deleteByTelescopeid
};