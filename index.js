var http     = require('http')
var _        = require('lodash')
var argv     = require('optimist').argv
var uuid     = require('node-uuid')
var request  = require('restler')
var strftime = require('strftime')

// <uuid>.<host>.<region>.<version>.<service>.<environment>.skydns.local

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
var host = _.contains(Object.keys(argv), 'skydns') ? argv['skydns'] : ( process.env.SKYDNS_PORT_8080_TCP_ADDR+':8080' )
if (host.indexOf('undefined') >= 0) { console.log('Error: Unable to verify skydns host:port. Either pass --skydns ip:port or link the skydns container.'); process.exit(1) }

var patch = function(data) {
    request
        .patch('http://'+host+'/skydns/services/'+data.uuid, {
            data : JSON.stringify({ttl:data.ttl})
        })
        .on('complete', function(d, res) {
            if (res.statusCode != 200) { console.log('Unhandled status code '+res.statusCode); process.exit(1); }
            else { console.log('Patched '+data.uuid+' '+strftime('%H:%M:%S %Y', new Date())) }
        })    
}

var patch_loop = function(data) {
    var p_time = (data.ttl - 2)
    var r_time = p_time >= 2 ? p_time : 2
    var loopinterval = setInterval(function() {
        patch(data)
    }, r_time*1000)
    patch(data)
}

var query_skydns = function(data) {
    request
        .put('http://'+host+'/skydns/services/'+data.uuid, {
            data : JSON.stringify(data)
        })
        .on('complete', function(d, res){
            if (res === null) { console.log(d); process.exit(1) }
            switch (res.statusCode) {
                case 201:
                    console.log('Created '+data.uuid+' '+strftime('%H:%M:%S %Y', new Date()))
                    patch_loop(data)
                    break
                case 409:
                    console.log('Conflict already registered.')
                    break
                case 400:
                    console.log('Client error / buggy data.')
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