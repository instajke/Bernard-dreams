'use strict'

var User = require('./user.controller');

exports.UpdateWallets = function (user, offers, response) {

        for (var i = 0; i < offers.length; i++) {
            user._id = offers[i].userID;
            user.wallet.amount = offers[i].amount;
            console.log("user");
            console.log(user);
            User.updateWallet(user, response);
        }
    };

exports.UpdateWallet = function(user, response) {
        User.updateWallet(user, response);
    };

