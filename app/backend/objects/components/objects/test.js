process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var path = require('path');
var server = require(path.join(__dirname,'../../app'));
var db = require(path.join(__dirname,'../../db/'));

chai.use(chaiHttp);

describe('Objects', () => {
    describe('/GET objects', () => {
        before((done) => {
            db.sync()
                .then(() => done())
                .catch((err) => done(err));
        });
        it('it should GET all the objects', (done) => {
            chai.request(server)
                .get('/api/v1/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.objects.should.be.a('array');
                    res.body.objects.length.should.be.eql(0);
                    done();
                });
        });

        it('it should GET count of the objects', (done) => {
            chai.request(server)
                .get('/api/v1/count')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.objects_count.should.be.a('number');
                    res.body.objects_count.should.be.eql(0);
                    done();
                });
        });
        it('it should not GET object with name obj1', (done) => {
            chai.request(server)
                .get('/api/v1/obj1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/POST objects', () => {
        obj1 = {
            "name": "obj1",
            "coord1": 1.0,
            "coord2": 2.0,
            "coord3": 3.0
        };

        it('it should create object', (done) => {
            chai.request(server)
                .post('/api/v1/')
                .send(obj1)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.object.should.be.a('object');
                    res.body.object.name.should.be.eql('obj1');
                    done();
                });
        });
        it('it should not create object', (done) => {
            chai.request(server)
                .post('/api/v1/')
                .send(obj1)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('/GET objects', () => {
        before((done) => {
            db.sync()
                .then(() => done())
                .catch((err) => done(err));
        });
        it('it should GET all the objects', (done) => {
            chai.request(server)
                .get('/api/v1/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.objects.should.be.a('array');
                    res.body.objects.length.should.be.eql(1);
                    done();
                });
        });
        it('it should GET count of the objects', (done) => {
            chai.request(server)
                .get('/api/v1/count')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.objects_count.should.be.a('number');
                    res.body.objects_count.should.be.eql(1);
                    done();
                });
        });
        it('it should GET object with name obj1', (done) => {
            chai.request(server)
                .get('/api/v1/obj1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.object.should.be.a('object');
                    res.body.object.name.should.be.eql('obj1');
                    done();
                });
        });
    });

    describe('/PUT objects', () => {
        obj2 = {
            "name": "obj1",
            "coord1": 1.0,
            "coord2": 2.0,
            "coord3": 4.0
        };
        notfoundobj = {
            "name": "obj2",
            "coord1": 1.0,
            "coord2": 2.0,
            "coord3": 4.0
        };
        it('it should update object', (done) => {
            chai.request(server)
                .put('/api/v1/')
                .send(obj2)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should not update object', (done) => {
            chai.request(server)
                .put('/api/v1/')
                .send(notfoundobj)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });    

    describe('/DELETE objects', () => {
        it('it should delete object', (done) => {
            chai.request(server)
                .delete('/api/v1/1')
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should not delete object', (done) => {
            chai.request(server)
                .delete('/api/v1/1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});