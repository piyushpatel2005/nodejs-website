const mongoose = require('mongoose');
const config = require('./db_url.js');
const bluebird = require('bluebird');

const options = {
    useMongoClient: true,
    // reconnectTries: 10, 
    // promiseLibrary: bluebird,
    // reconnectInterval: 500
}
module.exports = () => {
    const db = mongoose.connect(config.mongodb, options);
    mongoose.connection.on('error', (err) => {
        console.log("Mongoose connection failed.", err);
    });

    mongoose.connection.once("connected", () => {
        console.log("Mongoose connected successfully");
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose connection disconnected.');
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose connection disconnected through app.');
            process.exit(0);
        });
    });

}