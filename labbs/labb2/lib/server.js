var express = require('express'); 

function start() {
    var app = express(); 

    app.get("/index.html", function (req, res, next){ 
        res.redirect("/");  
    }); 

    app.get('/', function (req, res, next) { 
        res.send(`<!doctype html>
        <html>
        <body>
            <form action='/save' method='get'>
                <input type='text' name='fname' /><br />
                <input type='number' name='age' /><br />
                <input type='file' name='photo'  /><br />
                <input type="submit" value="Send Request">
            </form>
        </body>
        </html>`); 
    }); 

    app.get('/save', function(req, res, next){ 
        console.log(req.body['post_body']);
        console.log("Adding message!");
    });

    app.get('/flag', function(req, res, next){
        console.log(req.body['id']);
        console.log("Flagging message!");
    });

    app.get('/getall', function(req, res, next){

        console.log("Getting all messages!");
        res.status(200).send("post1");
    });

    app.delete("*", function(req, res){
        res.send("Fuck off!");
    });

    var server = app.listen(3000, "127.0.0.1",  function () { 
        var location = server.address();
        var host = location.address;
        var port = location.port; 
        console.log('Example app listening at http://%s:%s', host, port); 
    });
};

exports.start = start;