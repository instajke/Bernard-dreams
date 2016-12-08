/**
 * Created by arseniy on 10/29/2016.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var shopSchema = new Schema ({
    name: String,
    devID: Schema.Types.ObjectId,
    offers: [{ ID: Number, currencyType: String, amount: Number, price: Number, discount: Number }],
    payPalAcc: String,
    publicHistory: Boolean,
    history: [{ currencyType: String, amount: Number, profit: Number, date: { type: Date, default: Date.now() }}]
});

var shop = mongoose.model('Shop', shopSchema);

module.exports = {
    getShop: function(ShopId, response) {
        shop.findOne({_id: new ObjectId(ShopId)}).exec(function (err,res) {
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
            response.json({"result": "SUCCESS", "shops": res});
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
                res.history.push(Shop.history[0]);
                res.save();
                response.json({success: true});
            }
        });
    },

    clearShopHistory: function (ShopId, response) {
        shop.findOne({_id: new ObjectId(ShopId)}).exec(function (err,res) {
            if(err) {
                response.send(500, {error: err});
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
                response.send(500, {error: err});
            } else {
                Shop.offers.ID = res.offers.length + 1;
                res.offers.push(Shop.offers);
                res.save();
                response.json({success: true});
            }
        });
    },

    updateShopOffer: function(Shop, response) {
        shop.findOne({_id: Shop._id}).exec(function (err,res){
            if(err){
                response.send(500, {error: err});
            } else {
                res.offers[Shop.offers.ID - 1] = Shop.offers;
                res.save();
                response.json({success: true});
            }
        });
    },

    removeShopOffer: function(Shop, response) {
        shop.findOne({_id: Shop._id}).exec(function (err,res){
            if(err){
                response.send(500, {error: err});
            } else {
                res = reduceOffersID(res, Shop);
                res.save();
                response.json({"result": "SUCCESS", "offers": res});
            }
        });
    }

};

function reduceOffersID(res, Shop) {
    for(var i = Shop.offers.ID; i < res.offers.length; i++)
        res.offers[i].ID--;
    res.offers.splice(Shop.offers.ID - 1, 1);
    return res;
}
