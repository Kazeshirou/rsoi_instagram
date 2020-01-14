var path = require('path');
var Visibility = require(path.join(__dirname, 'model'));
var Telescopes = require(path.join(__dirname, '../telescopes'));
var Objects = require(path.join(__dirname, '../objects'));
var logger = require(path.join(__dirname, '../../utilities/logger'));


function resolve_refs(telescopeid, objectid) {
    return new Promise((resolve) => {
        Promise.allSettled([Telescopes.byId(telescopeid), Objects.byId(objectid)])
            .then(([telescoperes, objectres]) => {
                var result = { telescopename: null, objectname: null };
                if (telescoperes.status == 'fulfilled' &&
                    telescoperes.value.statusCode == 200) {
                    result.telescopename = telescoperes.value.body.telescope.name;
                }
                if (objectres.status == 'fulfilled' &&
                    objectres.value.statusCode == 200) {
                    result.objectname = objectres.value.body.object.name;
                }
                resolve(result);
            })
            .catch(err => {
                logger.error(err);
                resolve({ telescopename: null, objectname: null });
            });
    });
}

function all(page) {
    return new Promise((resolve, reject) => {
        Visibility.findAll(page)
            .then(result => {
                if (result.statusCode != 200) {
                    return resolve(result)
                }

                var promises = result.body.visibility.map(vis =>
                    resolve_refs(vis.telescopeid, vis.objectid));
                Promise.allSettled(promises)
                    .then(res => {
                        var visibility = res.map((resi, i) => {
                            var visi = result.body.visibility[i]
                            if (resi.status != "fulfilled") {
                                logger.error(resi.value);
                                return visi;
                            }

                            visi.telescopename = resi.value.telescopename;
                            visi.objectname = resi.value.objectname

                            return visi;
                        });

                        result.body = {
                            visibility: visibility
                        };

                        resolve(result);
                    })
                    .catch(err => reject(err))
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
                    return resolve(result)
                }

                var visibility = result.body.visibility;
                resolve_refs(visibility.telescopeid, visibility.objectid)
                    .then(({ telescopename, objectname }) => {
                        visibility.telescopename = telescopename;
                        visibility.objectname = objectname;
                        result.body.visibility = visibility
                        resolve(result);
                    })
                    .catch(err => {
                        logger.error(err);
                        resolve(result);
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