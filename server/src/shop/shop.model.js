/**
 * Created by arseniy on 10/29/2016.
 */
var mongoose = require('mongoose').set('debug', true);

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var shopSchema = new Schema ({
    devID: String,
    name: String,
    internalCurrency: String,
    externalCurrency: String,
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
                console.log("try update");
                res.history.push(Shop.history);
                res.save();
                //response.json({success: true});
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

    addShopOffer: function(Shop, Offer, response) {

        shop.update( {_id : Shop._id}, { $push: { offers : Offer }}, function(err, res) {
            if (err) {
                response.status(500).send(err);
            } else {
                response.status(200).send(res);
            }
        })
    },

    updateShopOffer: function(Shop, Offer, response) {

        shop.update( { _id : Shop._id, "offers._id" : Offer._id }, { $set: { "offers.$" : Offer }}, function(err, res) {
            if (err) {
                response.status(500).send(err);
            } else {
                response.status(200).send(res);
            }
        })
    },

    removeShopOffer: function(ShopID, OfferID, response) {
        shop.update({_id: ShopID}, { $pull: { offers: { _id : OfferID } } }, function(err, res) {
            if (err) {
                response.status(500).send(err);
            } else {
                response.status(200).send(res);
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
