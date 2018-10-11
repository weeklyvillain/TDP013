var server = require('./lib/server');

function server_start(){

    server.start();
};

function server_stop(){
    server.close()
};


if (require.main === module) {
    server_start();
}
