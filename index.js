var http    = require('http')
var _       = require('lodash')
var argv    = require('optimist').argv
var uuid    = require('node-uuid')
var request = require('superagent');

var struct = {
    "uuid"        : uuid.v4().split('-')[0],
    "name"        : "",
    "version"     : "",
    "environment" : "",
    "region"      : "",
    "host"        : "",
    "port"        : 80,
    "ttl"         : 10
}

var data = _(_(_(struct).clone(true)).merge(argv)).pick(function(value, key) { return _.contains(Object.keys(struct), key) }).__wrapped__

// <uuid>.<host>.<region>.<version>.<service>.<environment>.skydns.local

var patch_loop = function(data) {
    var loopinterval = setInterval(function() {
        request
            .patch('http://172.2.0.2:8080/skydns/services/'+data.uuid)
            .send({ttl:data.ttl})
            .end(function(error, res) {
                console.log('patch', error, res.status)
            })        
    }, (data.ttl*1000)/2)
}

var query_skydns = function(data) {
    request
        .put('http://172.2.0.2:8080/skydns/services/'+data.uuid)
        .send(data)
        .end(function(error, res){
            if (error) { console.log(error); sys.exit(1); }
            switch (res.status) {
                case 201:
                    console.log('created')
                    patch_loop(data)
                    break
                case 409:
                    console.log('conflict already registered')
                    break
                case 400:
                    console.log('client error / buggy data')
                    break
                default:
                    console.log(res, 'Unhandled response '+res.status+'.')
            }
        });
}
query_skydns(data);

// var ip_pattern = new RegExp(/([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\d{1,3}\.){3}\d{1,3}/)
// var match_ip = '192.168.0.1'.match(ip_pattern)
// var match_name = 'domain.com'.match(ip_pattern)
// console.log(match_ip, match_name)