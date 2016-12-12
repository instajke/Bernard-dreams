var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserAccount = new Schema({
    nickname: String,
    password: String,
    name    : String,
    email   : String
});

module.exports = mongoose.model('UserAccount', UserAccount);
