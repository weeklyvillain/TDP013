var server = require('./lib/server');

function server_start(){

    server.start(); 
};

function server_stop(){
    
};


if (require.main === module) {
    server_start();
}