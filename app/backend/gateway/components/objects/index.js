var path = require('path');
var Object = require(path.join(__dirname, 'model'));
var logger = require(path.join(__dirname, '../../utilities/logger'))


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
                if (res.statusCode !== 204) {
                    return resolve(res);
                }

                let Visibility = require(path.join(__dirname, '../visibility'));
                Visibility.deleteByObjectid(id)
                    .then(res1 => {
                        if (res1.statusCode !== 204) {
                            logger.error({
                                message: `Объект с id = ${id} удалён, но не удалось удалить все связанные с ним видимости.`
                            });
                        }
                        return resolve(res);
                    })
                    .catch(err => {
                        if (err.statusCode === 424) {
                            logger.error({
                                message: `Объект с id = ${id} удалён, но сервис видимостей был не доступен.`,
                                detail: err
                            });
                        } else {
                            logger.error({
                                message: `Объект с id = ${id} удалён, но при удалении связанных видимостей возникли проблемы.`,
                                detail: err
                            });
                        }
                        return resolve(res);
                    })
            })
            .catch(err => {
                return reject(err);
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