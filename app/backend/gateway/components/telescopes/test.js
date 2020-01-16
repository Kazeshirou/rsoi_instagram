process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var sinon = require('sinon');

var path = require('path');
var server = require(path.join(__dirname, '../../app'));
var model = require('./model')

chai.use(chaiHttp);

describe('Gateway Telescopes', () => {

    var sandbox = sinon.createSandbox();

    afterEach(function () {
        sandbox.restore();
    });

    describe('/GET telescopes', () => {
        var tel1 = {
            "name": "tel1",
            "type": "type1",
            "country": "country1",
            "city": "city1"
        };
        it('it should GET all the telescopes', (done) => {
            var findAll = sandbox.stub(model, "findAll").resolves({
                statusCode: 200,
                body: {
                    telescopes: [
                        tel1
                    ]
                }
            });
            chai.request(server)
                .get('/api/v1/telescopes/?page=0&limit=5')
                .end((err, res) => {
                    var page = {
                        page: '0',
                        limit: '5'
                    }
                    findAll.calledOnce.should.be.eql(true);
                    findAll.args[0][0].should.be.deep.eql(page);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.telescopes.should.be.a('array');
                    res.body.telescopes.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET count telescopes', () => {
        it('it should GET count the telescopes', (done) => {
            var count = sandbox.stub(model, "count").resolves({
                statusCode: 200
            });
            chai.request(server)
                .get('/api/v1/telescopes/count')
                .end((err, res) => {
                    count.calledOnce.should.be.eql(true);
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/GET telescope by id', () => {
        it('it should GET telescope by id', (done) => {
            var findById = sandbox.stub(model, "findById").resolves({
                statusCode: 200
            });
            chai.request(server)
                .get('/api/v1/telescopes/id/1')
                .end((err, res) => {
                    findById.calledOnceWith('1').should.be.eql(true);
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/GET telescope by name', () => {
        it('it should GET telescope by name', (done) => {
            var findByName = sandbox.stub(model, "findByName").resolves({
                statusCode: 200
            });
            chai.request(server)
                .get('/api/v1/telescopes/tel1')
                .end((err, res) => {
                    findByName.calledOnceWith('tel1').should.be.eql(true);
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/POST create telescope', () => {
        var tel1 = {
            "name": "tel1",
            "type": "type1",
            "country": "country1",
            "city": "city1"
        };
        it('it should create telescope', (done) => {
            var createTelescope = sandbox.stub(model, "createTelescope").resolves({
                statusCode: 204
            });
            chai.request(server)
                .post('/api/v1/telescopes/')
                .send(tel1)
                .end((err, res) => {
                    createTelescope.calledOnceWith(tel1).should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });
    });

    describe('/PUT update telescope', () => {
        var tel1 = {
            "name": "tel1",
            "type": "type1",
            "country": "country1",
            "city": "city1"
        };
        it('it should update telescope', (done) => {
            var updateTelescope = sandbox.stub(model, "updateTelescope").resolves({
                statusCode: 204
            });
            chai.request(server)
                .put('/api/v1/telescopes/')
                .send(tel1)
                .end((err, res) => {
                    updateTelescope.calledOnceWith(tel1).should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });
    });

    describe('/DELTE delete telescope', () => {
        var visibility = require(path.join(__dirname, '../visibility'));

        it('it should delete telescope', (done) => {
            var deleteTelescope = sandbox.stub(model, "deleteTelescope").resolves({
                statusCode: 204
            });
            var deleteVisibilityByTelescopeid = sandbox.stub(visibility, "deleteByTelescopeid")
                .resolves({
                    statusCode: 204
                })
            chai.request(server)
                .delete('/api/v1/telescopes/1')
                .end((err, res) => {
                    deleteTelescope.calledOnceWith('1').should.be.eql(true);
                    deleteVisibilityByTelescopeid.calledOnceWith('1').should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });

        it('it should not delete telescope cause it does not exist', (done) => {
            var deleteTelescope = sandbox.stub(model, "deleteTelescope").resolves({
                statusCode: 404
            });
            var deleteVisibilityByTelescopeid = sandbox.stub(visibility, "deleteByTelescopeid")
                .resolves({
                    statusCode: 204
                })
            chai.request(server)
                .delete('/api/v1/telescopes/1')
                .end((err, res) => {
                    deleteTelescope.calledOnceWith('1').should.be.eql(true);
                    deleteVisibilityByTelescopeid.calledOnce.should.be.eql(false);
                    res.should.have.status(404);
                    done();
                });
        });

        it('it should delete telescope but visibility service does not respond', (done) => {
            var queue = require(path.join(__dirname, '../../utilities/queue'));
            var queuepop = sandbox.stub(queue, "push").resolves();
            var deleteTelescope = sandbox.stub(model, "deleteTelescope").resolves({
                statusCode: 204
            });
            var deleteVisibilityByTelescopeid = sandbox.stub(visibility, "deleteByTelescopeid")
                .rejects({
                    statusCode: 424
                })
            chai.request(server)
                .delete('/api/v1/telescopes/1')
                .end((err, res) => {
                    deleteTelescope.calledOnceWith('1').should.be.eql(true);
                    deleteVisibilityByTelescopeid.calledOnceWith('1').should.be.eql(true);
                    queuepop.calledOnce.should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });
    });

});