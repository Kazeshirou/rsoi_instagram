var path = require('path');
var Visibility = require(path.join(__dirname, 'model'));
var Telescopes = require(path.join(__dirname, '../telescopes'));
var Objects = require(path.join(__dirname, '../objects'));;

function all(page) {
    return new Promise((resolve, reject) => {
        Visibility.findAll(page)
            .then(result => {
                if (result.statusCode != 200) {
                    resolve(result)
                    return
                }

                promises = [];
                for (let vis of result.body.visibility) {
                    promises.push(byId(vis.id));
                }

                Promise.all(promises)
                    .then(res => {
                        result.statusCode = 200;
                        result.body.visibility = res.map(resi => {
                                if (resi.statusCode != 200) {
                                    return null;
                                }

                                return resi.body.visibility;
                            })
                            .filter(resi => {
                                return resi ? true : false;
                             });

                        resolve(result);
                    })
                    .catch(err => reject(err));
            
            })
            .catch(err => reject(err));
    });
}

function count() {
    return Visibility.count();
}

function byId(id) {
    return new Promise((resolve, reject) => {
        Visibility.findById(id)
            .then(result => {
                if (result.statusCode != 200) {
                    resolve(result)
                    return
                }

                var visibility = result.body.visibility;

                Promise.all([Telescopes.byId(visibility.telescopeid), Objects.byId(visibility.objectid)])
                    .then(res => {
                        result.body.visibility.telescopename = res[0].body.telescope ? res[0].body.telescope.name : null;
                        result.body.visibility.objectname = res[1].body.object ? res[1].body.object.name : null;
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => reject(err));
    });
}

function create(visibility) {
    return new Promise((resolve, reject) => {
        Promise.all([Telescopes.byId(visibility.telescopeid), Objects.byId(visibility.objectid)])
            .then(res => {
                if (res[0].statusCode != 200) {
                    var result = {};
                    result.statusCode = 400;
                    result.body = {
                        err: {
                            message: 'Can\'t found telescope with id = ' + visibility.telescopeid
                        }
                    };
                    resolve(result);
                    return;
                }
                if (res[1].statusCode != 200) {
                    var result = {};
                    result.statusCode = 400;
                    result.body = {
                        err: {
                            message: 'Can\'t found object with id = ' + visibility.objectid
                        }
                    };
                    resolve(result);
                    return;
                }

                Visibility.createVisibility(visibility)
                    .then(result => resolve(result))
                    .catch(err => reject(err));
            })
            .catch(err => {
                reject(err);
            });
    });
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

module.exports = {
    all,
    byId,
    count,
    create,
    deleteById,
    deleteByTelescopeid,
    deleteByObjectid
};