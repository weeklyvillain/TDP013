var expect  = require('chai').expect;
var request = require('request');
var app = require('../lib/server');


var server = app.listen(3000, "127.0.0.1",  function () {
    var location = server.address();
    var host = location.address;
    var port = location.port;
    console.log('Example app listening at http://%s:%s', host, port);
});

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
        request('http://localhost:3000/index.html', function(error, response, body) {

            expect(response.request['path']).to.be.equal('/');
        done();
        });
    });
});



after(function(){
    server.close();
});
    