console.log('eple')

var http = require('http')
var _    = require('lodash')

console.log(_.map)

var options = {
  hostname : 'www.google.com',
  port     : 80,
  path     : '/upload',
  method   : 'GET'
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    // console.log('BODY: ' + chunk);
  });
});

req.end()