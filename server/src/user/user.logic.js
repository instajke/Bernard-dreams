'use strict'

var User = require('./user.controller');

exports.UpdateWallets = function (user, offers, response, newTransactionType) {

        for (var i = 0; i < offers.length; i++) {
            var myLittleFriend = {};
            myLittleFriend._id = offers[i].userID;
            myLittleFriend.wallet = {};
            myLittleFriend.wallet.amount = offers[i].amount;
            myLittleFriend.wallet.marketID = user.wallet.marketID;
            myLittleFriend.wallet.currencyType = user.wallet.currencyType;
            console.log("myLittleFriend");
            console.log(myLittleFriend);
            User.updateWallet(myLittleFriend, response, newTransactionType);
        }
    };

exports.UpdateWallet = function(user, response, newTransactionType) {
        User.updateWallet(user, response, newTransactionType);
    };

