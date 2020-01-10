process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var path = require('path');
var server = require(path.join(__dirname,'../../app'));
var db = require(path.join(__dirname,'../../db/'));

chai.use(chaiHttp);

describe('Visibilitys', () => {
    describe('/GET visibilitys', () => {
        before((done) => {
            db.sync()
                .then(() => done())
                .catch((err) => done(err));
        });
        it('it should GET all the visibilitys', (done) => {
            chai.request(server)
                .get('/api/visibilitys/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibilitys.should.be.a('array');
                    res.body.visibilitys.length.should.be.eql(0);
                    done();
                });
        });

        it('it should GET count of the visibilitys', (done) => {
            chai.request(server)
                .get('/api/visibilitys/count')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibilitys_count.should.be.a('number');
                    res.body.visibilitys_count.should.be.eql(0);
                    done();
                });
        });
        it('it should not GET visibility with name tel1', (done) => {
            chai.request(server)
                .get('/api/visibilitys/tel1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/POST visibilitys', () => {
        tel1 = {
            "name": "tel1",
            "type": "type1",
            "country": "country1",
            "city": "city1"
        };

        it('it should create visibility', (done) => {
            chai.request(server)
                .post('/api/visibilitys/')
                .send(tel1)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.visibility.should.be.a('object');
                    res.body.visibility.name.should.be.eql('tel1');
                    done();
                });
        });
        it('it should not create visibility', (done) => {
            chai.request(server)
                .post('/api/visibilitys/')
                .send(tel1)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('/GET visibilitys', () => {
        before((done) => {
            db.sync()
                .then(() => done())
                .catch((err) => done(err));
        });
        it('it should GET all the visibilitys', (done) => {
            chai.request(server)
                .get('/api/visibilitys/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibilitys.should.be.a('array');
                    res.body.visibilitys.length.should.be.eql(1);
                    done();
                });
        });
        it('it should GET count of the visibilitys', (done) => {
            chai.request(server)
                .get('/api/visibilitys/count')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibilitys_count.should.be.a('number');
                    res.body.visibilitys_count.should.be.eql(1);
                    done();
                });
        });
        it('it should GET visibility with name tel1', (done) => {
            chai.request(server)
                .get('/api/visibilitys/tel1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.visibility.should.be.a('object');
                    res.body.visibility.name.should.be.eql('tel1');
                    done();
                });
        });
    });

    describe('/PUT visibilitys', () => {
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
        it('it should update visibility', (done) => {
            chai.request(server)
                .put('/api/visibilitys/')
                .send(tel2)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should not update visibility', (done) => {
            chai.request(server)
                .put('/api/visibilitys/')
                .send(notfoundtel)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });    

    describe('/DELETE visibilitys', () => {
        it('it should delete visibility', (done) => {
            chai.request(server)
                .delete('/api/visibilitys/tel1')
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should not delete visibility', (done) => {
            chai.request(server)
                .delete('/api/visibilitys/tel1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});