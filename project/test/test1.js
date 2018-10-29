var chai  = require('chai'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var app = require('../lib/server');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
    var dbo = db.db("tdp013");
    dbo.collection("Users").drop(function(err, result) {
        dbo.collection("Profiles").drop(function(err, result) {
            dbo.collection("Posts").drop(function(err, result) {
                db.close();
            });
        });
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
      it('should test to add user to database', function(done) {
        chai.request(app)
          .get('/register')
          .query({newUsername: "testUser",
                  newPassword: "TestPassword123",
                  newDisplayName: "Some random user"})
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          });
      });

      it('should test to add existing user to database', function(done) {
        chai.request(app)
          .get('/register')
          .query({newUsername: "testUser",
                  newPassword: "TestPassword123",
                  newDisplayName: "Some random user"})
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          });
      });

      it('should test to add user with bad username to database', function(done) {
        chai.request(app)
          .get('/register')
          .query({newUsername: "user",
                  newPassword: "TestPassword123",
                  newDisplayName: "Some random user"})
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          });
      });


      it('should test to add user with bad password to database', function(done) {
        chai.request(app)
          .get('/register')
          .query({newUsername: "testUser",
                  newPassword: "short",
                  newDisplayName: "Some random user"})
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          });
      });


      it('should test to add user with bad DisplayName to database', function(done) {
        chai.request(app)
          .get('/register')
          .query({newUsername: "testUser",
                  newPassword: "TestPassword123",
                  newDisplayName: ""})
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          });
      });

      it('should test to add another user to database', function(done) {
          chai.request(app)
          .get('/register')
          .query({newUsername: "User1234",
          newPassword: "TestPassword123",
          newDisplayName: "Random user"})
          .end(function(err, res) {
              expect(res).to.have.status(200);
              setTimeout(done, 50);
          });
      });

      it('should test to login with created test user', function(done) {
        chai.request(app)
          .get('/login')
          .query({username: "testUser",
                  password: "TestPassword123"})
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          });
      });

  });
describe('Test user funcs', function(){
        before(function(done){
          chai.request(app)
            .get('/login')
            .query({username: "testUser",
                    password: "TestPassword123"})
            .end(function(err, response){
              expect(response.statusCode).to.equal(200);
              setTimeout(done, 50);
            });
        });


      it('should test to get profile', function(done) {
        chai.request(app)
          .get('/getProfile')
          .query({profilePage: "testUser"})
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          });
      });

      it('should test to get friends', function(done) {
        chai.request(app)
          .get('/getFriendsList')
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          });
      });

      it('should test to add friend', function(done) {
        chai.request(app)
          .get('/addFriend')
          .query({FriendDisplayName: "Random user",
                    FriendLoginName: "User1234"})
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          });
      });

      it('should test to add friend', function(done) {
        chai.request(app)
          .get('/getAll')
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          });
      });

      it('should test save', function(done) {
        chai.request(app)
          .get('/search')
          .query({searchedName: 'Random user'})
          .end(function(err, res) {
            expect(res).to.have.status(200);
            setTimeout(done, 50);
          })
      });

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
          setTimeout(done, 50);
        });
    });


});
