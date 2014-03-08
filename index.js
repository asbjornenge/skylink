var http = require('http')
var _    = require('lodash')
var argv = require('optimist').argv

var arguments = {
    name : {
        validate : function(value) { return value.length > 0 },
    }
}

var validate_input = function(prop, value) {
    switch (prop) {
        case 'name':
            return value.length > 0
        case 'target':
            return value.length > 0
        case 'ttl':
            return typeof value === 'number' && value > 0
    }
};

['name','target','ttl'].forEach(function(req_prop) {
    if (!_.contains(Object.keys(argv), req_prop)) {
        console.log('Missing required parameter: '+req_prop)
        process.exit(1)
    }
    if (!validate_input(req_prop, argv[req_prop])) {
        console.log('Invalid property value: '+req_prop+' '+argv[req_prop])
        process.exit(1)
    }
})

console.log('ready to query skydns')

// var ip_pattern = new RegExp(/([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\d{1,3}\.){3}\d{1,3}/)
// var match_ip = '192.168.0.1'.match(ip_pattern)
// var match_name = 'domain.com'.match(ip_pattern)
// console.log(match_ip, match_name)