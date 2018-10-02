var express = require('express'); 

function start() {
    var app = express(); 

    app.get('/', function (req, res) { 
        res.send(`<!doctype html>
        <html>
        <body>
            <form action='/add_message' method='post'>
                <input type='text' name='fname' /><br />
                <input type='number' name='age' /><br />
                <input type='file' name='photo' /><br />
                <input type="submit" value="Send Request">
            </form>
        </body>
        </html>`); 
    }); 

    app.get("/index.html", function (req, res){ 
        res.redirect("/"); 
        
    }); 

    app.post('/add_message', function(req, res, next){ 
        console.log(req.body['fname']);
        console.log("Adding message!");
        //...
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
