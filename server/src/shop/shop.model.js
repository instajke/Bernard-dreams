/**
 * Created by arseniy on 10/29/2016.
 */
var mongoose = require('mongoose').set('debug', true);

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var shopSchema = new Schema ({
    devID: String,
    name: String,
    marketID: Schema.Types.ObjectId, // price per item ($)
    offers: [{ ID: Number, currencyType: String, amount: Number, price: Number, discount: Number }],
    payPalAcc: String,
    publicHistory: Boolean,
    history: [{ currencyType: String, amount: Number, profit: Number, date: { type: Date, default: Date.now() }}]
});

var shop = mongoose.model('Shop', shopSchema);

module.exports = {
    getShop: function(ShopId, response) {
        shop.findOne({_id: ShopId}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "shop": res});
            }
        });
    },

    searchShop: function(request, response) {
        shop.find({name: request.params.name}).exec(function (err,res){
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "shop": res});
            }
        });
    },

    getShops: function(response) {
        shop.find().exec(function(err,res) {
          if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "shops": res});
            }
        });
    },

    getShopByMarketId: function(marketID, response) {
        console.log("model method marketID");
        console.log(marketID);
        shop.findOne({marketID : marketID}).exec(function(err, res) {
            if (err) {
                response.send(500, {err: err});
            } else {
                response.json({"result" : "SUCCESS", "shop": res});
                console.log(res);
            }
        });
    },

    getShopsByDevId : function(request, response) {
        shop.find({devID : request.params.devID}).exec(function (err, res){
            if (err) {
                response.send(500, {error: err});
            } else {
                response.json({"result" : "SUCCESS", "shops" : res});
            }
        });
    },


    updateShopHistoryByMarketID: function (Shop, response) {
         shop.findOne({marketID: Shop.marketID}).exec(function (err,res) {
            if(err) {
                response.send(500, {error: err});
            } else {
                res.history.push(Shop.history);
                res.save();
                response.json({success: true});
            }
        });
    },

    postShop: function(Shop, response) {
        shop.create(Shop, function (err, res){
            if(err) {
                response.send(500, {error: err});
            } else {
                response.json({success: true});
            }
        });
    },

    updateShopHistory: function (Shop, response) {
        shop.findOne({_id: Shop._id}).exec(function (err,res) {
            if(err) {
                response.send(500, {error: err});
            } else {
                res.history.push(Shop.history);
                res.save();
                response.json({success: true});
            }
        });
    },

    clearShopHistory: function (ShopId, response) {
        shop.findOne({_id: ShopId}).exec(function (err,res) {
            if(err) {
                response.status(500).send(err);
            } else {
                res.history = [];
                res.save();
                response.json({success: true});
            }
        });
    },

    updateShopPayPalAcc: function(Shop, response) {
        shop.findOne({_id: Shop._id}).exec(function (err,res){
            if(err){
                response.send(500, {error: err});
            } else {
                res.payPalAcc = Shop.payPalAcc;
                res.save();
                response.json({success: true});
            }
        });
    },

    addShopOffer: function(Shop, response) {
        shop.findOne({_id: Shop._id}).exec(function (err,res){
            if(err){
                console.log("ERROR");
                response.send(500, {error: err});
            } else {
                console.log("OKAY WE GOOD");
                for (var index = 0; index < Shop.offers.length; ++index) {
                    Shop.offers[index].ID = res.offers.length + index + 1;
                    res.offers.push(Shop.offers[index]);
                }
                console.log(Shop.offers)
                console.log(res);
                res.save();
                response.json({success: true});
            }
        });
    },

    updateShopOffer: function(Shop, Offer, response) {
        shop.findOne({_id: Shop._id}).exec(function (err,res){
            if(err){
                response.send(500, {error: err});
            } else {

                for (var i=0; i < res.offers.length; i++) {
                    if (res.offers[i].ID === Offer.ID) {
                        res.offers[i] = Offer;
                    }
                }
                //res.offers[Shop.offers.ID - 1] = Shop.offers;
                res.save();
                response.json({success: true});
            }
        });
    },

    removeShopOffer: function(ShopID, OfferID, response) {
        shop.findOne({_id: ShopID}).exec(function (err,res){
            if(err){
                response.send(500, {error: err});
            } else {
                console.log("REMOVE RESPONSE OFFERS BEFORE");
                console.log(res.offers);
                for (var index = OfferID; index < res.offers.length; ++index) {
                    res.offers[index].ID--;
                }
                res.offers.splice(OfferID - 1, 1);
                console.log("REMOVE ID")
                console.log(OfferID)
                console.log("REMOVE RESPONSE OFFERS AFTER");
                console.log(res.offers);
                res.save();
                response.json({"result": "SUCCESS", "offers": res});
            }
        });
    },

    findShopsByMarketId : function(marketIdArray, response) {
        marketIdArray.forEach(function(item) {
            item = Schema.Types.ObjectId(item);
        });
        console.log("converted array");
        console.log(marketIdArray);
        shop.find({ marketID : { $in : marketIdArray }}, function ( err, docs ) {
                response.json({"result" : "SUCCESS", "shops" : docs});
            })
        }
};

function reduceOffersID(res, Shop) {
    for(var i = Shop.offers.ID; i < res.offers.length; i++)
        res.offers[i].ID--;
    res.offers.splice(Shop.offers.ID - 1, 1);
    return res;
}
