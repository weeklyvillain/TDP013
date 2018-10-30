var express = require('express');
var session = require('express-session');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var cors = require('cors');


const saltRounds = 10;

passport.use(new LocalStrategy(
  function(username, password, done) {
    MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
      var dbo = db.db("tdp013");
      dbo.collection("Users").findOne({LoginName: username}, function (err, user) {
        db.close();
        if (!user) {
          return done(null, false, { message: 'Incorrect Username or Password.' });
        }
        bcrypt.compare(password, user.Password, function(err, result){
            if(result){
              return done(null, user);
            }else{
              return done(null, false, {message: 'Incorrect Username or Password.'});
            }
        });
    });
  });
}
));

passport.serializeUser(function(user, done) {
    done(null, user.LoginName);
});

passport.deserializeUser(function(Username, done) {
    MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
        var dbo = db.db("tdp013");
        dbo.collection("Profiles").findOne({LoginName: Username}, function (err, user) {
            db.close();
            done(err, user);
        });
    });
});

    var app = express();
    app.use(session({ secret: "catsIsGood", resave: true, saveUninitialized: true, cookie: { secure: false } }));
    app.use(passport.initialize());
    app.use(passport.session());

    var corsOptions = {
        origin: [/localhost/, /127.0.0.1/ ],
        credentials: true
    }


    app.use(cors(corsOptions));

  app.get('/login', function(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
          if (err) { return next(err); }
          if (!user) { return res.redirect('/login'); }

          req.login(user, (err) => {
            if(err) throw err;
            return res.send(user.LoginName);
          });
      })(req, res, next) ;
  });


    app.get("/index.html", function (req, res){
        res.redirect("/");
    });

    app.get('/', function (req, res, next) {
        res.status(200).send();
    });

    app.get('/getAll', function(req, res){
        MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
            var dbo = db.db("tdp013");
            dbo.collection("Posts").find({UserPage: req.query.UserPage}).toArray(function(err, result) {
                db.close();
                res.status(200).send(result);
            });
        });
    });

    app.get('/flag', function(req, res){
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
              var new_values = {$set:{Flag: 1}};
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
    });

    app.get('/save', function(req, res){
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
              var message_obj = { Message: req.query.message, UserPage: req.query.UserPage, UserPosted: req.query.UserPosted, Flag: parseInt(req.query.Flag)};
              dbo.collection("Posts").insertOne(message_obj, function(err, result) {
                  db.close();
                });
              });
              res.redirect("/");
    });


    app.get('/register', function(req, res){
        if(req.query.newDisplayName.length < 1 || req.query.newDisplayName.length > 32){
            res.send("wrongLengthDisplayName");
            return;
        }
        if(req.query.newUsername.length < 6 || req.query.newUsername.length > 20){
            res.send("wrongLengthUsername");
            return;
        }
        if(req.query.newPassword.length < 8 && req.query.newPassword.length > 24){
            res.send("wrongLengthPassword");
            return;
        }
        MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
            var dbo = db.db("tdp013");
            var myQuery = { LoginName : req.query.newUsername}
            dbo.collection("Users").findOne(myQuery, function(err, result){
                if(result !== null){
                    res.send("notUniqueLoginName");
                    return;
                }else{
                    bcrypt.hash(req.query.newPassword, saltRounds, function(err, hashed_pass){
                        var userObj = { LoginName : req.query.newUsername, Password : hashed_pass };
                        dbo.collection("Users").insertOne(userObj, function(err, result) {
                            dbo.collection("Users").findOne({LoginName: req.query.newUsername}, function(err, result){
                                var profileObj = { userId: ObjectId(result._id), LoginName: result.LoginName, DisplayName: req.query.newDisplayName, FriendsList: [] }
                                dbo.collection("Profiles").insertOne(profileObj, function(err, result){
                                    res.send("success");
                                    return;
                                });
                            });
                         });
                    });
                }
            });
        });
    });

    app.get('/getProfile', function(req, res){
        if(req.isAuthenticated()){
            MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
                var dbo = db.db("tdp013");
                dbo.collection('Profiles').aggregate([
                    {'$match':{'LoginName': req.query.profilePage}},
                    {'$lookup':{
                        from: 'Posts',
                        localField: 'LoginName',
                        foreignField: 'UserPage',
                        as: 'Posts'
                    }}
                ]).toArray(function(err, result){
                    db.close();
                    res.send(result);
                });
            });
        }else{
            res.send("Not logged in!");
        }
    });

    app.get('/getFriendsList', function(req, res){
        if(req.isAuthenticated()){
            MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
                var dbo = db.db("tdp013");
                dbo.collection('Profiles').findOne({LoginName: req.user.LoginName}, function(err, result){
                    res.send(result.FriendsList);
                    return;
                });
            });
        } else {
            res.send("Not logged in!");
        }
    });

    app.get('/addFriend', function(req, res){
        if(req.isAuthenticated()){
            MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
                var dbo = db.db("tdp013");
                dbo.collection("Profiles").updateOne({LoginName: req.user.LoginName}, {$addToSet :  { FriendsList: [req.query.FriendLoginName, req.query.FriendDisplayName ]}}, function(err, result) {
                    dbo.collection("Profiles").updateOne({LoginName: req.query.FriendLoginName}, {$addToSet :  { FriendsList: [req.user.LoginName, req.user.DisplayName ]}}, function(err, result) {
                        if(result.result.nModified != 0){
                            res.send("success");
                            return;
                        }else{
                            res.send("failure");
                            return;
                        }
                    });
                });
            });
        } else {
            res.send("Not logged in!");
        }
    });

    app.get('/search', function(req, res){
      MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, function (err, db) {
          var dbo = db.db("tdp013");
          dbo.collection("Profiles").find({DisplayName: req.query.searchedName}).toArray(function(err, result) {
              db.close();
              res.send(result);
          });
      });

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
