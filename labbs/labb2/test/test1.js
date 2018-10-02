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
              //test here
            
            done();
            });
        });

    });
