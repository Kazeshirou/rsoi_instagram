process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var sinon = require('sinon');

var path = require('path');
var server = require(path.join(__dirname, '../../app'));
var model = require('./model')

chai.use(chaiHttp);

describe('Gateway Objects', () => {

    var sandbox = sinon.createSandbox();

    afterEach(function () {
        sandbox.restore();
    });

    describe('/GET objects', () => {
        var obj1 = {
            "name": "obj1",
            "coord1": "1",
            "coord2": "2",
            "coord3": "3"
        };
        it('it should GET all the objects', (done) => {
            var findAll = sandbox.stub(model, "findAll").resolves({
                statusCode: 200,
                body: {
                    objects: [
                        obj1
                    ]
                }
            });
            chai.request(server)
                .get('/api/v1/objects/?page=0&limit=5')
                .end((err, res) => {
                    var page = {
                        page: '0',
                        limit: '5'
                    }
                    findAll.calledOnce.should.be.eql(true);
                    findAll.args[0][0].should.be.deep.eql(page);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.objects.should.be.a('array');
                    res.body.objects.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET count objects', () => {
        it('it should GET count the objects', (done) => {
            var count = sandbox.stub(model, "count").resolves({
                statusCode: 200
            });
            chai.request(server)
                .get('/api/v1/objects/count')
                .end((err, res) => {
                    count.calledOnce.should.be.eql(true);
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/GET object by id', () => {
        it('it should GET object by id', (done) => {
            var findById = sandbox.stub(model, "findById").resolves({
                statusCode: 200
            });
            chai.request(server)
                .get('/api/v1/objects/id/1')
                .end((err, res) => {
                    findById.calledOnceWith('1').should.be.eql(true);
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/GET object by name', () => {
        it('it should GET object by name', (done) => {
            var findByName = sandbox.stub(model, "findByName").resolves({
                statusCode: 200
            });
            chai.request(server)
                .get('/api/v1/objects/obj1')
                .end((err, res) => {
                    findByName.calledOnceWith('obj1').should.be.eql(true);
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/POST create object', () => {
        var obj1 = {
            "name": "obj1",
            "coord1": "1",
            "coord2": "2",
            "coord3": "3"
        };
        it('it should create object', (done) => {
            var createObject = sandbox.stub(model, "createObject").resolves({
                statusCode: 204
            });
            chai.request(server)
                .post('/api/v1/objects/')
                .send(obj1)
                .end((err, res) => {
                    createObject.calledOnceWith(obj1).should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });
    });

    describe('/PUT update object', () => {
        var obj1 = {
            "name": "obj1",
            "type": "type1",
            "country": "country1",
            "city": "city1"
        };
        it('it should update object', (done) => {
            var updateObject = sandbox.stub(model, "updateObject").resolves({
                statusCode: 204
            });
            chai.request(server)
                .put('/api/v1/objects/')
                .send(obj1)
                .end((err, res) => {
                    updateObject.calledOnceWith(obj1).should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });
    });

    describe('/DELTE delete object', () => {
        var visibility = require(path.join(__dirname, '../visibility'));

        it('it should delete object', (done) => {
            var deleteObject = sandbox.stub(model, "deleteObject").resolves({
                statusCode: 204
            });
            var deleteVisibilityByObjectid = sandbox.stub(visibility, "deleteByObjectid")
                .resolves({
                    statusCode: 204
                })
            chai.request(server)
                .delete('/api/v1/objects/1')
                .end((err, res) => {
                    deleteObject.calledOnceWith('1').should.be.eql(true);
                    deleteVisibilityByObjectid.calledOnceWith('1').should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });

        it('it should not delete object cause it does not exist', (done) => {
            var deleteObject = sandbox.stub(model, "deleteObject").resolves({
                statusCode: 404
            });
            var deleteVisibilityByObjectid = sandbox.stub(visibility, "deleteByObjectid")
                .resolves({
                    statusCode: 204
                })
            chai.request(server)
                .delete('/api/v1/objects/1')
                .end((err, res) => {
                    deleteObject.calledOnceWith('1').should.be.eql(true);
                    deleteVisibilityByObjectid.calledOnce.should.be.eql(false);
                    res.should.have.status(404);
                    done();
                });
        });

        it('it should not delete object cause visibility service does not respond', (done) => {
            var queue = require(path.join(__dirname, '../../utilities/queue'));
            var queuepop = sandbox.stub(queue, "push").resolves();
            var deleteObject = sandbox.stub(model, "deleteObject").resolves({
                statusCode: 204
            });
            var recoveryObject = sandbox.stub(model, "recoveryObject").resolves({
                statusCode: 204
            });
            var deleteVisibilityByObjectid = sandbox.stub(visibility, "deleteByObjectid")
                .rejects({
                    statusCode: 424
                })
            chai.request(server)
                .delete('/api/v1/objects/1')
                .end((err, res) => {
                    deleteObject.calledOnceWith('1').should.be.eql(true);
                    deleteVisibilityByObjectid.calledOnceWith('1').should.be.eql(true);
                    recoveryObject.calledOnceWith('1').should.be.eql(true);
                    res.should.have.status(503);
                    done();
                });
        });
    });

});