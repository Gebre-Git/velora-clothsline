// server/test-connection.js
const mongoose = require('mongoose');

// WE ARE BYPASSING .ENV FOR ONE SECOND TO TEST THE CONNECTION
const uri = "mongodb+srv://gebre2024mail_db_user:cxXGxyNdNdxeD5ms@velora.8xujaw0.mongodb.net/velora_db?retryWrites=true&w=majority";

console.log("--- Manual Connection Test ---");
console.log("Attempting to connect to: velora.8xujaw0.mongodb.net");

mongoose.connect(uri)
    .then(() => {
        console.log("⭐⭐⭐⭐⭐ SUCCESS! ⭐⭐⭐⭐⭐");
        console.log("The connection string is PERFECT.");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ STILL FAILING!");
        console.error("Error Type:", err.name);
        console.error("Message:", err.message);
        process.exit(1);
    });