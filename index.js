var http = require('http')
var _    = require('lodash')
var argv = require('optimist').argv

console.log(argv)

var validate_input = function(prop, value) {
    console.log(prop, value);
    return true
};

['name','target','ttl'].forEach(function(req_prop) {
    if (!_.contains(Object.keys(argv), req_prop)) {
        console.log('Missing required parameter: '+req_prop)
        process.exit(1)
    }
    if (!validate_input(req_prop, argv[req_prop])) {
        console.log('Invalid property: '+req_prop)
        process.exit(1)
    }
})

// var ip_pattern = new RegExp(/([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\d{1,3}\.){3}\d{1,3}/)
// var match_ip = '192.168.0.1'.match(ip_pattern)
// var match_name = 'domain.com'.match(ip_pattern)
// console.log(match_ip, match_name)