var path = require('path');
var Object = require(path.join(__dirname, 'model'));

function all(page) {
    return Object.findAll(page);
}

function count() {
    return Object.count();
}

function byName(name) {
    return Object.findByName(name);
}

function create(object) {
    return Object.createObject(object);
}

function deleteByName(name) {
    return Object.deleteObject(name);
}

function updateByName(object) {
    return Object.updateObject(object);
}

module.exports = {
    all,
    byName,
    count,
    create,
    deleteByName,
    updateByName
};