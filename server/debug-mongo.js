require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri);

mongoose.connect(uri, { family: 4 })
    .then(() => {
        console.log('✅ Connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:');
        console.error(err);
        process.exit(1);
    });
