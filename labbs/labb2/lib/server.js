var express = require('express'); 
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;


function get_all(req, res){
    MongoClient.connect("mongodb://localhost:27017", function (err, db) {
        if (err) throw err;
        var dbo = db.db("tdp013");
        dbo.collection("Posts").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            return result;
        });   
    });
};

function start() {
    var app = express(); 

    app.get("/index.html", function (req, res, next){ 
        res.redirect("/");  
    }); 

    app.get('/', function (req, res, next) { 
        res.status(200).send(`<!doctype html>
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
                console.log(res);
                db.close();
              });
            });
            res.redirect("/"); 
    });

    app.get('/flag', function(req, res, next){
        MongoClient.connect("mongodb://localhost:27017", function (err, db) {
            if (err) throw err;
            var dbo = db.db("tdp013");
            var my_query = {_id: ObjectId(req.query.id)};
            var new_values = {$set:{Flag: true}};
            dbo.collection("Posts").updateOne(my_query, new_values, function(err, res) {
                if (err) throw err;
                console.log(res);
                db.close();
            });
            res.status(200).send("");
        });
    });

    app.get('/getall', function(req, res, next){
       var result = get_all(res,req);
       res.status(200).send("All Messages gotten!");
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

start();
