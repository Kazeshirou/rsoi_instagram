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

function byId(id) {
    return Object.findById(id);
}

function create(object) {
    return Object.createObject(object);
}

function deleteById(id) {
    return new Promise((resolve, reject) => {
        Object.deleteObject(id)
            .then(res => {
                var Visibility = require(path.join(__dirname, '../visibility'));
                Visibility.deleteByObjectid(id)
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
    updateByName
};