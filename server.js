var http = require('http');

var server = http.createServer(require('./app'));

server.listen(process.env.PORT, function(){
  console.log('listening on ' + process.env.PORT);
});
