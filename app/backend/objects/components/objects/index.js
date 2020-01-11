var path = require('path');
var Object = require(path.join(__dirname, 'model'));

async function all(limit, page) {
    return Object.all(limit, page);
}

async function count() {
    return Object.count();
}

async function byName(name) {
    return Object.findByName(name);
}

async function byId(id) {
    return Object.findById(id);
}

async function create(object) {
    return Object.createObject(object);
}

async function deleteByName(name) {
    return Object.deleteObject(name);
}

async function updateByName(object) {
    return Object.updateObject(object);
}

module.exports = {
    all,
    byName,
    byId,
    count,
    create,
    deleteByName,
    updateByName
};