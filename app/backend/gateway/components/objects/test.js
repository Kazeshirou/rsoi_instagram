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
                .get('/api/objects/')
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
                .get('/api/objects/count')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.objects_count.should.be.a('number');
                    res.body.objects_count.should.be.eql(0);
                    done();
                });
        });
        it('it should not GET object with name tel1', (done) => {
            chai.request(server)
                .get('/api/objects/tel1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/POST objects', () => {
        tel1 = {
            "name": "tel1",
            "type": "type1",
            "country": "country1",
            "city": "city1"
        };

        it('it should create object', (done) => {
            chai.request(server)
                .post('/api/objects/')
                .send(tel1)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.object.should.be.a('object');
                    res.body.object.name.should.be.eql('tel1');
                    done();
                });
        });
        it('it should not create object', (done) => {
            chai.request(server)
                .post('/api/objects/')
                .send(tel1)
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
                .get('/api/objects/')
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
                .get('/api/objects/count')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.objects_count.should.be.a('number');
                    res.body.objects_count.should.be.eql(1);
                    done();
                });
        });
        it('it should GET object with name tel1', (done) => {
            chai.request(server)
                .get('/api/objects/tel1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.object.should.be.a('object');
                    res.body.object.name.should.be.eql('tel1');
                    done();
                });
        });
    });

    describe('/PUT objects', () => {
        tel2 = {
            "name": "tel1",
            "type": "type2",
            "country": "country2",
            "city": "city2"
        };
        notfoundtel = {
            "name": "tel2",
            "type": "type2",
            "country": "country2",
            "city": "city2"
        };
        it('it should update object', (done) => {
            chai.request(server)
                .put('/api/objects/')
                .send(tel2)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should not update object', (done) => {
            chai.request(server)
                .put('/api/objects/')
                .send(notfoundtel)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });    

    describe('/DELETE objects', () => {
        it('it should delete object', (done) => {
            chai.request(server)
                .delete('/api/objects/tel1')
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should not delete object', (done) => {
            chai.request(server)
                .delete('/api/objects/tel1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});