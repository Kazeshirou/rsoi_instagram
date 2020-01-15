var path = require('path');
var Visibility = require(path.join(__dirname, 'model'));

function all(limit, page) {
    return Visibility.all(limit, page);
}

function count() {
    return Visibility.count();
}

function byId(id) {
    return Visibility.findById(id);
}

function create(visibility) {
    return Visibility.createVisibility(visibility);
}

function deleteById(id) {
    return Visibility.deleteVisibility(id);
}

function deleteByTelescopeid(id) {
    return Visibility.deleteVisibilityByTelescopeid(id);
}

function deleteByObjectid(id) {
    return Visibility.deleteVisibilityByObjectid(id);
}

function deleteById(id) {
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