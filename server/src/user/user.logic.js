'use strict'

var User = require('./user.model');

exports.UpdateWallets = function (user, offers, response) {

        for (var i = 0; i < offers.length; i++) {
            user.userID = offers[i].userID;
            user.wallet.amount = offers[i].amount;
            User.updateWallet(user, response);
        }
    };

exports.UpdateWallet = function(user, response) {
        User.updateWallet(user, response);
    };
