'use strict'

var gamer = require('./gamer.model');

exports.UpdateWallets = function (mygamer, offers, response) {

        for (var i = 0; i < offers.length; i++) {
            mygamer.userID = offers[i].gamerID;
            mygamer.wallet.amount = offers[i].amount;
            gamer.updateWallet(mygamer, response);
        }
    };

exports.UpdateWallet = function(mygamer, response) {
        gamer.updateWallet(mygamer, response);
    };
