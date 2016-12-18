var shop = require('./shop/shop.model');

module.exports = {

    updateShopHistory: function(Shop, response){
        shop.updateShopHistory(Shop, response);
    },

    updateShopHistoryByMarketID: function(Shop, response){
        shop.updateShopHistoryByMarketID(Shop, response);
    }

};
