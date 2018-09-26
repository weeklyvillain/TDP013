var express = require('express'); 
var MongoClient = require('mongodb').MongoClient;

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
                <input type='text' name='message' /><br />
                <input type="submit" value="Send Request">
            </form>
        </body>
        </html>`); 
    }); 

    app.get('/save', function(req, res, next){ 
        MongoClient.connect("mongodb://localhost:27017", function (err, db) {
            if (err) throw err;
            var dbo = db.db("tdp013");
            var message_obj = { Message: req.query.message, Flag: false };
            dbo.collection("Posts").insertOne(message_obj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");  
              });
              db.close();
            });
    });

    app.get('/flag', function(req, res, next){
        console.log(req.body['message']);
        console.log("Flagging message!");
    });

    app.get('/getall', function(req, res, next){
        MongoClient.connect("mongodb://localhost:27017", function (err, db) {
            if (err) throw err;
            dbo.collection("Posts").find(function(err, res) {
                console.log(res);
            });    
            db.close();
        });
            var dbo = db.db("tdp013");

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