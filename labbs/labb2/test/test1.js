var chai  = require('chai'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var app = require('../lib/server');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
    var dbo = db.db("tdp013");
    dbo.collection("Posts").drop(function(err, result) {
          db.close();
      });
    });

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
      });

      it('should test post (405)', function(done){
        chai.request(app)
          .post('/')
          .end(function (err, res) {
              expect(res).to.have.status(405);
              done();
          });
      });

      it('should test put (405)', function(done){
        chai.request(app)
          .put('/')
          .end(function (err, res) {
              expect(res).to.have.status(405);
              done();
          });
      });

      it('should test delete (405)', function(done){
        chai.request(app)
          .delete('/')
          .end(function (err, res) {
              expect(res).to.have.status(405);
              done();
          });
      });

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


  describe('MongoDB', function(){
      it('should test save', function(done) {
        chai.request(app)
          .get('/save')
          .query({message: 'foobar'})
          .end(function(err, res) {
            expect(res['req']['path']).to.be.equal('/');
            setTimeout(done, 50);
          })
      });

      it('should test save without message', function(done) {
        chai.request(app)
          .get('/save')
          .end(function(err, res) {
            expect(res).to.have.status(400);
            setTimeout(done, 50);
          })
      });

      it('should test save with empty message', function(done) {
        chai.request(app)
          .get('/save')
          .query({message: 'qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop'})
          .end(function(err, res) {
            expect(res).to.have.status(400);
            setTimeout(done, 50);
          })
      });


      it('should test flag with wrong id', function(done) {
        chai.request(app)
          .get('/flag')
          .query({id: 'thisIsWrongItShouldNotWork'})
          .end(function(err, res) {
            expect(res).to.have.status(400);
            setTimeout(done, 50);
          })
      });

      it('should test flag without id', function(done) {
        chai.request(app)
          .get('/flag')
          .end(function(err, res) {
            expect(res).to.have.status(400);
            setTimeout(done, 50);
          })
      });
      var jsonObj;
      it('should return all messages stored in database', function(done) {
        chai.request(app)
          .get('/getall')
          .end(function(err, res) {
            jsonObj = JSON.parse(res['text']);
            expect(jsonObj.length).to.be.equal(1);
            setTimeout(done, 50);
          })
      });

    it('should test flag', function(done) {
      chai.request(app)
        .get('/flag')
        .query({id: jsonObj[0]['_id']})
        .end(function(err, res) {
          expect(res).to.have.status(200);
          setTimeout(done, 50);
        });
    });

    it('should test to flag already flagged id', function(done) {
      chai.request(app)
        .get('/flag')
        .query({id: jsonObj[0]['_id']})
        .end(function(err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });
});
