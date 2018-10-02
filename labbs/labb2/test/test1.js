<<<<<<< HEAD
var expect  = require('chai').expect;
var request = require('request');

describe('Error handling', function() {
        it('should test status 200', function(done){
            request('http://localhost:3000/', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('should test status 404', function(done){
            request('http://localhost:3000/non_existing_page', function(error, response, body) {
                expect(response.statusCode).to.equal(404);
                done();
            });
        })
    });

    describe ('Main page', function() {
        it('/ should return index.html', function(done){
            request('http://localhost:3000/', function(error, response, body) {
              request('http://localhost:3000/index.html', function(error, res, bod) {
                expect(body).to.equal(bod);
              });
            done();
            });
        });

    });
=======
>>>>>>> e50b6d84779714e8a156b8e5ada65403a50507fe
