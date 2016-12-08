var sell = require('./marketSell/marketSell.model');


exports.updateIllusivePrice = function(marketId, percent, response){
    sell.UpdatePriceIllusive(marketId, percent, response);
}
