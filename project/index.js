var app = require('./lib/server');

function server_start(){
    var server = app.listen(3001, function () {
      console.log("Server running");
    });
};

function server_stop(){
    server.close()
};


if (require.main === module) {
    server_start();
}
