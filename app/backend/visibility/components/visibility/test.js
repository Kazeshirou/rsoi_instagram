process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var path = require('path');
var server = require(path.join(__dirname,'../../app'));
var db = require(path.join(__dirname,'../../db/'));

chai.use(chaiHttp);

describe('Visibility', () => {
    describe('/GET visibility', () => {
        before((done) => {
            db.sync()
                .then(() => done())
                .catch((err) => done(err));
        });
        it('it should GET all the visibility', (done) => {
            chai.request(server)
                .get('/api/v1/?page=1&limit=5')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibility.should.be.a('array');
                    res.body.visibility.length.should.be.eql(0);
                    done();
                });
        });

        it('it should GET count of the visibility', (done) => {
            chai.request(server)
                .get('/api/v1/count')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibility_count.should.be.a('number');
                    res.body.visibility_count.should.be.eql(0);
                    done();
                });
        });
        it('it should not GET visibility with id 1', (done) => {
            chai.request(server)
                .get('/api/v1/1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/POST visibility', () => {
        vis1 = {
            "telescopeid": 1,
            "objectid": 1,
        };

        it('it should create visibility', (done) => {
            chai.request(server)
                .post('/api/v1/')
                .send(vis1)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.visibility.should.be.a('object');
                    res.body.visibility.telescopeid.should.be.eql(1);
                    done();
                });
        });
        it('it should not create visibility', (done) => {
            chai.request(server)
                .post('/api/v1/')
                .send(vis1)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('/GET visibility', () => {
        before((done) => {
            db.sync()
                .then(() => done())
                .catch((err) => done(err));
        });
        it('it should GET all the visibility', (done) => {
            chai.request(server)
                .get('/api/v1/?page=1&limit=5')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibility.should.be.a('array');
                    res.body.visibility.length.should.be.eql(1);
                    done();
                });
        });
        it('it should GET count of the visibility', (done) => {
            chai.request(server)
                .get('/api/v1/count')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibility_count.should.be.a('number');
                    res.body.visibility_count.should.be.eql(1);
                    done();
                });
        });
        it('it should GET visibility with id 1', (done) => {
            chai.request(server)
                .get('/api/v1/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibility.should.be.a('object');
                    res.body.visibility.id.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/DELETE visibility', () => {
        it('it should delete visibility', (done) => {
            chai.request(server)
                .delete('/api/v1/1')
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should not delete visibility', (done) => {
            chai.request(server)
                .delete('/api/v1/1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});