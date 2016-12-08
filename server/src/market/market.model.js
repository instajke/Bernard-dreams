'use strict';

var mongoose = require('mongoose');
var marketLogic = require('./market.logic');

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var marketSchema = new Schema ({
    devID: Schema.Types.ObjectId,
    marketType: String,
    name: String,
    description: String,
    showOffers: Boolean,
    tax: Number, // percents
    newPrice: Number, // amount of buying that might change price in illusive markets
    currencyType1: String, // gold
    currencyType2: String // gems
    //priceBuy: Number,
    // priceSell: Number
});

var market = mongoose.model('Market', marketSchema);


exports.getMarket = function(marketId, response) {
    market.findOne({_id: new ObjectId(marketId)}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            response.json({"result": "SUCCESS", "market": res});
        }
    });
};

exports.searchMarket = function(request, response) {
    market.find({name: request.params.name}).exec(function (err,res){
        if(err){
            response.send(500, {error: err});
        } else {
            response.json({"result": "SUCCESS", "market": res});
        }
    });
};

exports.getMarkets = function(response) {
    market.find().exec(function(err,res) {
        response.json({"result": "SUCCESS", "markets": res});
    });
};

exports.postMarket = function(Market, response) {
    market.create(Market, function (err, doc){
        if(err) {
            response.send(500, {error: err});
        } else
            var MarketSell = {
                marketID: doc._id,
                marketType: doc.marketType,
                taxes: doc.tax,
                currencyTypeSell: doc.currencyType1,
                currencyTypeAnother: doc.currencyType2,
                bestPrice: null,
                curBuyings: 0,
                newPrice: doc.newPrice,
                offers: [],
                graphicSell: []
            };
            var MarketBuy = {
                marketID: doc._id,
                marketType: doc.marketType,
                taxes: doc.tax,
                currencyAnother: doc.currencyType1,
                currencyTypeBuy: doc.currencyType2,
                bestPrice: null,
                curBuyings: 0,
                newPrice: doc.newPrice,
                offers: [],
                graphicBuy: []
            };
            marketLogic.postMarketBuyAndSell(MarketBuy, MarketSell);
            response.json({success: true});
    });
};

exports.updateMarketShowOffers = function (Market, response) {
    market.findOne({_id: Market._id}).exec(function (err,res) {
        if(err) {
            response.send(500, {error: err});
        } else {
            res.showOffers = Market.showOffers;
            res.save();
            response.json({success: true});
        }
    });
};

exports.updateMarketType = function (Market, response) {
    market.findOne({_id: Market._id}).exec(function (err,res) {
        if(err) {
            response.send(500, {error: err});
        } else {
            res.marketType = Market.marketType;
            res.save();
            response.json({success: true});
        }
    });
};

exports.updateMarketTax = function (Market, response) {
    market.findOne({_id: Market._id}).exec(function (err,res) {
        if(err) {
            response.send(500, {error: err});
        } else {
            res.tax = Market.tax;
            res.save();
            response.json({success: true});
        }
    });
};

exports.updateMarketDescription = function (Market, response) {
    market.findOne({_id: Market._id}).exec(function (err,res) {
        if(err) {
            response.send(500, {error: err});
        } else {
            res.description = Market.description;
            res.save();
            response.json({success: true});
        }
    });
}
