/**
 * Created by arseniy on 11/2/2016.
 */
var buy = require('../marketSell/marketSell.model');
var sell = require('../marketBuy/marketBuy.model');
var gamer = require('../gamer/gamer.model');

module.exports = {

    // gamer: { userID, DesirePrice, wallet: [{ curType, amount, marketID }] }

    MakeTransactionBuy: function(mygamer, response) {
        buy.checkPriceSell(mygamer, response, gamer.checkPayingCapacity, buy.UpdateMarket);

    },

    MakeTransactionSell: function(mygamer, response) {
        sell.checkPriceBuy(mygamer, response, gamer.checkPayingCapacity, sell.UpdateMarket);
    },

    MakeOfferBuy: function(userId, cost, currencyType, price, amount, marketID, response) {
        gamer.justCheckPayingCapacity(userId, cost, currencyType, marketID, price, amount, response, sell.findOrCreateOffer);
    },

    MakeOfferSell: function(userId, cost, currencyType, price, amount, marketID, response) {
        gamer.justCheckPayingCapacity(userId, cost, currencyType, marketID, price, amount, response, buy.findOrCreateOffer);
    }

    // shop transaction will be added soon

};
