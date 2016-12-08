'use strict';

var market = require('./market.controller.js');
var marketBuy = require('../marketBuy/marketBuy.controller.js');
var marketSell = require('../marketSell/marketSell.controller.js');

module.exports = {

    updateTaxes: function(Market, response) {
        market.updateMarketTax(Market, response);
        marketBuy.updateTax(Market, response);
        marketSell.updateTax(Market, response);
    },

    updateMarketType: function(Market, response) {
        market.updateMarketType(Market, response);
        marketBuy.updateMarketType(Market, response);
        marketSell.updateMarketType(Market, response);
    },

    postMarketBuyAndSell: function (MarketBuy, MarketSell) {
        marketBuy.postMarketBuy(MarketBuy);
        marketSell.postMarketSell(MarketSell);
    }

};
