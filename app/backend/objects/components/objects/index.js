var path = require('path');
var Object = require(path.join(__dirname, 'model'));

function all(limit, page) {
    return Object.all(limit, page);
}

function count() {
    return Object.count();
}

function byName(name) {
    return Object.findByName(name);
}

function byId(id) {
    return Object.findById(id);
}

function create(object) {
    return Object.createObject(object);
}

function deleteById(id) {
    return Object.deleteObject(id);
}

function recoveryById(id) {
    return Object.recoveryObject(id);
}

function updateByName(object) {
    return Object.updateObject(object);
}

module.exports = {
    all,
    byName,
    byId,
    count,
    create,
    deleteById,
    recoveryById,
    updateByName
};