const mongoose = require("mongoose");
mongoose.set('debug', true);
mongoose.Propmise = Promise;

// mongoose.connect("mongodb://admin:owl313777@ds155164.mlab.com:55164/bbhub",{
    mongoose.connect(process.env.MONGO_URL || "mongodb://admin:owl313777@ds155164.mlab.com:55164/bbhub",{
    keepAlive:true,
    useNewUrlParser: true
});

module.exports.User = require('./user')
module.exports.Product = require('./product')
module.exports.Ecourse = require('./ecourse')
module.exports.Lesson = require('./lesson')