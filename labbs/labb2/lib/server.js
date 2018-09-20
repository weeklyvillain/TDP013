var express = require('express'); 

function start() {
    var app = express(); 
    app.get('/', function (req, res) { 
        res.send('Hello World!'); 
    }); 
    
    var server = app.listen(3000, "127.0.0.1",  function () { 
        var location = server.address();
        var host = location.address;
        var port = location.port; 
        console.log('Example app listening at http://%s:%s', host, port); 
    });
};

exports.start = start;