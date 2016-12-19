var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Transactions = new Schema({
    date: { type: Date, default: Date.now },
    currencyType: String,
    amount: Number,
    marketID: Schema.Types.ObjectId
});

var Wallet = new Schema({
    currencyType: String,
    amount: Number,
    marketID: Schema.Types.ObjectId
});

var User = new Schema({
    username: String,
    email: String,
    name: String,
    surname: String,
    description: String,
    password: String,
    facebookToken: String,
    googleToken: String,
    twitterToken: String,
    paypal: { type: String, default: null },
    isDev: { type: Boolean, default: null },
    date: { type: Date, default: Date.now() },
    transactions: [Transactions],
    wallet: [Wallet]
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);
