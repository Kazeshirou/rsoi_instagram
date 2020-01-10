process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var path = require('path');
var server = require(path.join(__dirname,'../../app'));
var db = require(path.join(__dirname,'../../db/'));

chai.use(chaiHttp);

describe('Telescopes', () => {
    describe('/GET telescopes', () => {
        before((done) => {
            db.sync()
                .then(() => done())
                .catch((err) => done(err));
        });
        it('it should GET all the telescopes', (done) => {
            chai.request(server)
                .get('/api/v1/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.telescopes.should.be.a('array');
                    res.body.telescopes.length.should.be.eql(0);
                    done();
                });
        });

        it('it should GET count of the telescopes', (done) => {
            chai.request(server)
                .get('/api/v1/count')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.telescopes_count.should.be.a('number');
                    res.body.telescopes_count.should.be.eql(0);
                    done();
                });
        });
        it('it should not GET telescope with name tel1', (done) => {
            chai.request(server)
                .get('/api/v1/tel1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('/POST telescopes', () => {
        tel1 = {
            "name": "tel1",
            "type": "type1",
            "country": "country1",
            "city": "city1"
        };

        it('it should create telescope', (done) => {
            chai.request(server)
                .post('/api/v1/')
                .send(tel1)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.telescope.should.be.a('object');
                    res.body.telescope.name.should.be.eql('tel1');
                    done();
                });
        });
        it('it should not create telescope', (done) => {
            chai.request(server)
                .post('/api/v1/')
                .send(tel1)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });

    describe('/GET telescopes', () => {
        before((done) => {
            db.sync()
                .then(() => done())
                .catch((err) => done(err));
        });
        it('it should GET all the telescopes', (done) => {
            chai.request(server)
                .get('/api/v1/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.telescopes.should.be.a('array');
                    res.body.telescopes.length.should.be.eql(1);
                    done();
                });
        });
        it('it should GET count of the telescopes', (done) => {
            chai.request(server)
                .get('/api/v1/count')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.telescopes_count.should.be.a('number');
                    res.body.telescopes_count.should.be.eql(1);
                    done();
                });
        });
        it('it should GET telescope with name tel1', (done) => {
            chai.request(server)
                .get('/api/v1/tel1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.telescope.should.be.a('object');
                    res.body.telescope.name.should.be.eql('tel1');
                    done();
                });
        });
    });

    describe('/PUT telescopes', () => {
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
        it('it should update telescope', (done) => {
            chai.request(server)
                .put('/api/v1/')
                .send(tel2)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should not update telescope', (done) => {
            chai.request(server)
                .put('/api/v1/')
                .send(notfoundtel)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });    

    describe('/DELETE telescopes', () => {
        it('it should delete telescope', (done) => {
            chai.request(server)
                .delete('/api/v1/tel1')
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
        it('it should not delete telescope', (done) => {
            chai.request(server)
                .delete('/api/v1/tel1')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});