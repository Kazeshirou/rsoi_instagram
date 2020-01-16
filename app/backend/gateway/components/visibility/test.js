process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var sinon = require('sinon');

var path = require('path');
var server = require(path.join(__dirname, '../../app'));
var model = require('./model')

chai.use(chaiHttp);

describe('Gateway Visibility', () => {

    var Telescopes = require(path.join(__dirname, '../telescopes'));
    var Objects = require(path.join(__dirname, '../objects'));

    var sandbox = sinon.createSandbox();
    var telById;
    var objById;
    beforeEach(() => {
        telById = sandbox.stub(Telescopes, "byId").resolves({
            statusCode: 200,
            body: {
                telescope: {
                    name: 'tel1'
                }
            }
        });
        objById = sandbox.stub(Objects, "byId").resolves({
            statusCode: 200,
            body: {
                object: {
                    name: 'obj1'
                }
            }
        });
    })

    afterEach(() => {
        sandbox.restore();
    });

    describe('/GET visibility', () => {
        it('it should GET all the visibility', (done) => {
            
            var findAll = sandbox.stub(model, "findAll").resolves({
                statusCode: 200,
                body: {
                    visibility: [
                        {
                            id: '1',
                            telescopeid: '2',
                            objectid: '3'
                        }
                    ]
                }
            });
            chai.request(server)
                .get('/api/v1/visibility/?page=0&limit=5')
                .end((err, res) => {
                    var page = {
                        page: '0',
                        limit: '5'
                    }
                    findAll.calledOnce.should.be.eql(true);
                    findAll.args[0][0].should.be.deep.eql(page);
                    telById.calledOnceWith("2").should.be.eql(true);
                    objById.calledOnceWith("3").should.be.eql(true);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibility.should.be.a('array');
                    res.body.visibility.length.should.be.eql(1);
                    res.body.visibility[0].telescopename.should.be.eql('tel1');
                    res.body.visibility[0].objectname.should.be.eql('obj1');
                    done();
                });
        });

        it('it should GET all the visibility with null telescopename and objectname', (done) => {
            var findAll = sandbox.stub(model, "findAll").resolves({
                statusCode: 200,
                body: {
                    visibility: [
                        {
                            id: '1',
                            telescopeid: '2',
                            objectid: '3'
                        }
                    ]
                }
            });
            telById.resolves({
                statusCode: 424
            });
            objById.resolves({
                statusCode: 424
            });

            chai.request(server)
                .get('/api/v1/visibility/?page=0&limit=5')
                .end((err, res) => {
                    var page = {
                        page: '0',
                        limit: '5'
                    }
                    findAll.calledOnce.should.be.eql(true);
                    findAll.args[0][0].should.be.deep.eql(page);
                    telById.calledOnceWith("2").should.be.eql(true);
                    objById.calledOnceWith("3").should.be.eql(true);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibility.should.be.a('array');
                    res.body.visibility.length.should.be.eql(1);
                    should.not.exist(res.body.visibility[0].objectname);
                    should.not.exist(res.body.visibility[0].telescopename);
                    done();
                });
        });
    });

    describe('/GET count visibility', () => {
        it('it should GET count the visibility', (done) => {
            var count = sandbox.stub(model, "count").resolves({
                statusCode: 200
            });
            chai.request(server)
                .get('/api/v1/visibility/count')
                .end((err, res) => {
                    count.calledOnce.should.be.eql(true);
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/GET visibility by id', () => {
        it('it should GET visibility by id', (done) => {
            var findById = sandbox.stub(model, "findById").resolves({
                statusCode: 200,
                body: {
                    visibility: 
                        {
                            id: '1',
                            telescopeid: '2',
                            objectid: '3'
                        }
                }
            });
            chai.request(server)
                .get('/api/v1/visibility/1')
                .end((err, res) => {
                    findById.calledOnceWith('1').should.be.eql(true);
                    telById.calledOnceWith("2").should.be.eql(true);
                    objById.calledOnceWith("3").should.be.eql(true);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibility.should.be.a('object');
                    res.body.visibility.telescopename.should.be.eql('tel1');
                    res.body.visibility.objectname.should.be.eql('obj1');
                    done();
                });
        });

        it('it should GET visibility by id  with null telescopename and objectname', (done) => {
            var findById = sandbox.stub(model, "findById").resolves({
                statusCode: 200,
                body: {
                    visibility:
                    {
                        id: '1',
                        telescopeid: '2',
                        objectid: '3'
                    }
                }
            });

            telById.resolves({
                statusCode: 424
            });
            objById.resolves({
                statusCode: 424
            });
            chai.request(server)
                .get('/api/v1/visibility/1')
                .end((err, res) => {
                    findById.calledOnceWith('1').should.be.eql(true);
                    telById.calledOnceWith("2").should.be.eql(true);
                    objById.calledOnceWith("3").should.be.eql(true);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibility.should.be.a('object');
                    should.not.exist(res.body.visibility.objectname);
                    should.not.exist(res.body.visibility.telescopename);
                    done();
                });
        });
    });

    describe('/POST create visibility', () => {
        var vis1 = {
            "telescopeid": "2",
            "objectid": "3"
        };
        it('it should create visibility', (done) => {
            var createVisibility = sandbox.stub(model, "createVisibility").resolves({
                statusCode: 204
            });
            chai.request(server)
                .post('/api/v1/visibility/')
                .send(vis1)
                .end((err, res) => {
                    createVisibility.calledOnceWith(vis1).should.be.eql(true);
                    telById.calledOnceWith("2").should.be.eql(true);
                    objById.calledOnceWith("3").should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });


        it('it should not create visibility cause telescope with id 2 not exist', (done) => {
            telById.resolves({
                statusCode: 404
            });
            chai.request(server)
                .post('/api/v1/visibility/')
                .send(vis1)
                .end((err, res) => {
                    telById.calledOnceWith("2").should.be.eql(true);
                    objById.calledOnceWith("3").should.be.eql(true);
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should not create visibility cause object with id 3 not exist', (done) => {
            objById.resolves({
                statusCode: 404
            });
            chai.request(server)
                .post('/api/v1/visibility/')
                .send(vis1)
                .end((err, res) => {
                    telById.calledOnceWith("2").should.be.eql(true);
                    objById.calledOnceWith("3").should.be.eql(true);
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should not create visibility cause objects not responses', (done) => {
            objById.resolves({
                statusCode: 424
            });
            chai.request(server)
                .post('/api/v1/visibility/')
                .send(vis1)
                .end((err, res) => {
                    telById.calledOnceWith("2").should.be.eql(true);
                    objById.calledOnceWith("3").should.be.eql(true);
                    res.should.have.status(400);
                    done();
                });
        });

        it('it should not create visibility cause telescopes not responses', (done) => {
            telById.resolves({
                statusCode: 424
            });
            chai.request(server)
                .post('/api/v1/visibility/')
                .send(vis1)
                .end((err, res) => {
                    telById.calledOnceWith("2").should.be.eql(true);
                    objById.calledOnceWith("3").should.be.eql(true);
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('/DELETE delete visibility', () => {
        it('it should delete visibility', (done) => {
            var deleteVisibility = sandbox.stub(model, "deleteVisibility").resolves({
                statusCode: 204
            });
            chai.request(server)
                .delete('/api/v1/visibility/1')
                .end((err, res) => {
                    deleteVisibility.calledOnceWith('1').should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });

        it('it should not delete visibility cause it does not exist', (done) => {
            var deleteVisibility = sandbox.stub(model, "deleteVisibility").resolves({
                statusCode: 404
            });
            chai.request(server)
                .delete('/api/v1/visibility/1')
                .end((err, res) => {
                    deleteVisibility.calledOnceWith('1').should.be.eql(true);
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/DELETE delete visibility by telescope id', () => {
        it('it should delete visibility', (done) => {
            var deleteVisibility = sandbox.stub(model, "deleteVisibilityByTelescopeid").resolves({
                statusCode: 204
            });
            chai.request(server)
                .delete('/api/v1/visibility/telescopeid/1')
                .end((err, res) => {
                    deleteVisibility.calledOnceWith('1').should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });
    });

    describe('/DELETE delete visibility by object id', () => {
        it('it should delete visibility', (done) => {
            var deleteVisibility = sandbox.stub(model, "deleteVisibilityByObjectid").resolves({
                statusCode: 204
            });
            chai.request(server)
                .delete('/api/v1/visibility/objectid/1')
                .end((err, res) => {
                    deleteVisibility.calledOnceWith('1').should.be.eql(true);
                    res.should.have.status(204);
                    done();
                });
        });
    });

});