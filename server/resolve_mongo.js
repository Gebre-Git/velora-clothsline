const dns = require('dns');

const srvHostname = '_mongodb._tcp.velora.8xujaw0.mongodb.net';

console.log('Resolving SRV only...');
dns.resolveSrv(srvHostname, (err, addresses) => {
    if (err) {
        console.error('SRV Error:', err);
    } else {
        console.log('SRV Records:', JSON.stringify(addresses, null, 2));
    }
});
