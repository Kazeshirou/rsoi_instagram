process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var server = require('./app');

describe("Gateway", () => {
    it("Genate not found", () => {
        chai.request(server)
            .get('/unknown_url')
            .end((err, res) => {
                res.should.have.status(404);
            })
    });
});


chai.use(chaiHttp);