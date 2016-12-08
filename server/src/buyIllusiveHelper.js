'use strict';

var buy = require('./marketBuy/marketBuy.controller');

exports.updateIllusivePrice = function(marketId, percent, response){
        buy.UpdatePriceIllusive(marketId, percent, response);
    };
