/**
 * Created by arseniy on 11/2/2016.
 */
var buy = require('../marketSell/marketSell.model');
var sell = require('../marketBuy/marketBuy.model');
var user = require('../user/user.controller');

module.exports = {

    // gamer: { userID, DesirePrice, wallet: [{ curType, amount, marketID }] }

    MakeTransactionBuy: function(mygamer, desirePrice, response) {
        buy.checkPriceSell(mygamer, desirePrice, response, user.checkPayingCapacity, buy.UpdateMarket);

    },

    MakeTransactionSell: function(mygamer, desirePrice, response) {
        sell.checkPriceBuy(mygamer, desirePrice, response, user.checkPayingCapacity, sell.UpdateMarket);
    },

    MakeOfferBuy: function(userId, currencyType, price, amount, marketID, response) {
        user.justCheckPayingCapacity(userId, currencyType, marketID, price, amount, response, sell.findOrCreateOffer);
    },

    MakeOfferSell: function(userId, currencyType, price, amount, marketID, response) {
        user.justCheckPayingCapacity(userId, currencyType, marketID, price, amount, response, buy.findOrCreateOffer);
    }

    // shop transaction will be added soon

};
