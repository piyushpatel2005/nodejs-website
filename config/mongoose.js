const mongoose = require('mongoose');
const config = require('./db_url.js');

module.exports = () => {
    const db = mongoose.connect(config.mongodb);
    console.log("Connection establidhed");
    return db;
}