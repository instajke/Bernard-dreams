var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserAccount = new Schema({
    nickname: String,
    email   : String,
    password: String,
    name    : String,
    surname : String,
    bio     : String
});

module.exports = mongoose.model('UserAccount', UserAccount);
