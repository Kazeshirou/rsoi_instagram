var path = require('path');
var Telescope = require(path.join(__dirname, 'model'));
var logger = require(path.join(__dirname, '../../utilities/logger'));
var queue = require(path.join(__dirname, '../../utilities/queue'));

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
            if (res.statusCode !== 204) {
                return resolve(res);
            }

            let Visibility = require(path.join(__dirname, '../visibility'));
            Visibility.deleteByTelescopeid(id)
                .then(res1 => {
                    if (res1.statusCode !== 204) {
                        logger.error({
                            message: `Телескоп с id = ${id} удалён, но не удалось удалить все связанные с ним видимости.`
                        });
                    }
                    return resolve(res);
                })
                .catch(err => {
                    if (err.statusCode === 424) {
                        return queue.push("visibility", { telescopeid: id })
                            .then(() => {
                                logger.error({
                                    message: `Телескоп с id = ${id} удалён, но сервис видимостей был не доступен.`,
                                    detail: err
                                });
                                resolve(res);
                            })
                            .catch(err => reject(err));
                    } else {
                        logger.error({
                            message: `Телескоп с id = ${id} удалён, но при удалении связанных видимостей возникли проблемы.`,
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