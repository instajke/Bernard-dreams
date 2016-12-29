'use strict';

var buy = require('./marketBuy/marketBuy.model');

exports.updateIllusivePrice = function(marketId, percent, response){
    buy.UpdatePriceIllusive(marketId, percent, response);
};
