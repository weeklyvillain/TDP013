var chai  = require('chai'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var app = require('../lib/server');

describe('Error handling', function() {
    it('should test status 200', function(done){
      chai.request(app)
        .get('/')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            done();
        });
    });

    it('should test status 404', function(done){
      chai.request(app)
        .get('/none_existing')
        .end(function (err, res) {
            expect(res).to.have.status(404);
            done();
        });
    })
});

describe('Main page', function() {
    it('index.html should return /', function(done){
      chai.request(app)
        .get('/index.html')
        .end(function (err, res) {
            expect(res['req']['path']).to.be.equal('/');
            done();
        });
    });
});


describe('get All', function(){
    it('git gud', function(done) {
      chai.request(app)
        .get('/getall')
        .end(function(err, res) {
          expect();
          done();
        })
    });
});
