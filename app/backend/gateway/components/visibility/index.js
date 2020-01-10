var path = require('path');
var Visibility = require(path.join(__dirname, 'model'));

function all(page) {
    return Visibility.findAll(page);
}

function count() {
    return Visibility.count();
}

function byName(name) {
    return Visibility.findByName(name);
}

function create(visibility) {
    return Visibility.createVisibility(visibility);
}

function deleteByName(name) {
    return Visibility.deleteVisibility(name);
}

function updateByName(visibility) {
    return Visibility.updateVisibility(visibility);
}

module.exports = {
    all,
    byName,
    count,
    create,
    deleteByName,
    updateByName
};