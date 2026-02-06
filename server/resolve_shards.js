const dns = require('dns');

const shards = [
    'velora-shard-00-00.8xujaw0.mongodb.net',
    'velora-shard-00-01.8xujaw0.mongodb.net',
    'velora-shard-00-02.8xujaw0.mongodb.net'
];

console.log('Testing guessed shard addresses...');

shards.forEach(shard => {
    dns.lookup(shard, (err, address, family) => {
        if (err) {
            console.log(`❌ ${shard}: Failed (${err.code})`);
        } else {
            console.log(`✅ ${shard}: ${address} (IPv${family})`);
        }
    });
});
