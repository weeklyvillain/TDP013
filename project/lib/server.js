var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var cors = require('cors');


    var app = express();

    app.use(cors());

    app.get("/index.html", function (req, res){
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


    function get_all(req, res, next){
        MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
            var dbo = db.db("tdp013");
            dbo.collection("Posts").find({}).toArray(function(err, result) {
                db.close();
                res.status(200).send(result);
            });
        });
    };

    function flag(req, res, next){
      if (!req.query.id){
          res.status(400).send("Status: 400 Missing Parameters");
          return;
      }
      if(req.query.id.length != 12 && req.query.id.length != 24 ){
          res.status(400).send("Status: 400 Wrong Parameters");
          return;
      }
        MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {

            var dbo = db.db("tdp013");
            var my_query = {_id: ObjectId(req.query.id)};
            var new_values = {$set:{Flag: true}};
            dbo.collection("Posts").updateOne(my_query, new_values, function(err, result) {

                if(result.result.nModified == 0 ){
                    res.status(400).send("Status: 400 Wrong Parameters");
                    db.close()
                    return;
                }
                res.status(200).send("");
                db.close();
            });
        });
    }

    function save(req, res, next){
      if (!req.query.message){
          res.status(400).send("Status: 400 Missing Parameters");
          return;
      }
      if(req.query.message.length <= 0 || req.query.message.length > 140 ){
          res.status(400).send("Status: 400 Wrong Parameters");
          return;
      }
        MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {

            var dbo = db.db("tdp013");
            var message_obj = { Message: req.query.message, Flag: false };
            dbo.collection("Posts").insertOne(message_obj, function(err, result) {

                db.close();
              });
            });
            res.redirect("/");
    }


    app.get('/getall', function(req, res){
        return get_all(req, res);
    });

    app.get('/flag', function(req, res){
        return flag(req, res);
    });
    app.get('/save', function(req, res){
        return save(req, res);
    });
    app.get('/login', function(req, res){
      MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
          var dbo = db.db("tdp013");
          dbo.collection("Profiles").find({LoginName: req.query.Username, Password: req.query.Password}, function(err, result) {
              db.close();
              if(result){
                res.status(200).send(true);
              } else {
                res.status(200).send(false);
              }
          });
      });
    });

    app.get('/register', function(req, res){
      MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {

          var dbo = db.db("tdp013");
          var userObj = { LoginName : req.query.Username, Password : req.query.Password, DisplayName :req.query.DisplayName, FriendsList : {}, DoB : req.query.DoB }
          dbo.collection("Profiles").insertOne(user_obj, function(err, result) {
              db.close();
            });
          });
          res.redirect("/");
    });

    app.get('/register', function(req, res){
        return save(req, res);
    });

    app.post("*", function(req, res){
        res.status(405).send("Status: 405 Wrong Method - Post");
    });

    app.put("*", function(req, res){
        res.status(405).send("Status: 405 Wrong Method - Put");
    });

    app.delete("*", function(req, res){
        res.status(405).send("Status: 405 - Wrong Method - Delete");
    });
    app.all("*", function(req, res){
        res.status(404).send("Status: 404 Something went wrong!");
    });

module.exports = app;
