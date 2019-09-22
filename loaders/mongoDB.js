// Set up mongoose connection
var mongoose = require('mongoose');

/**
 * mongoUrl - includels mongodbv host,port,user with password 
 */
var mongoDB = process.env.DB.MONGOURL

// Create Connection
mongoose.connect(mongoDB,{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;

// Handle mongo error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));