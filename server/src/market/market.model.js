'use strict';

var mongoose = require('mongoose');
var marketLogic = require('./market.logic');

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var marketSchema = new Schema ({
    devID: String,
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

module.exports = {
    getMarket : function(marketId, response) {
        market.findOne({_id: new ObjectId(marketId)}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "market": res});
            }
        });
    },

    searchMarket : function(request, response) {
        market.find({name: request.params.name}).exec(function (err,res){
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "market": res});
            }
        });
    },

    getMarkets : function(response) {
        market.find().exec(function(err,res) {
            response.json({"result": "SUCCESS", "markets": res});
        });
    },

    postMarket : function(Market, response) {
        market.create(Market, function (err, doc){
                console.log("2");
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
                return response.status(201).json(doc);
        });
    },

    updateMarketShowOffers : function (Market, response) {
        market.findOne({_id: Market._id}).exec(function (err,res) {
            if(err) {
                response.send(500, {error: err});
            } else {
                res.showOffers = Market.showOffers;
                res.save();
                response.json({success: true});
            }
        });
    },

    updateMarketType : function (Market, response) {
        market.findOne({_id: Market._id}).exec(function (err,res) {
            if(err) {
                response.send(500, {error: err});
            } else {
                res.marketType = Market.marketType;
                res.save();
                response.json({success: true});
            }
        });
    },

    updateMarketTax : function (Market, response) {
        market.findOne({_id: Market._id}).exec(function (err,res) {
            if(err) {
                response.send(500, {error: err});
            } else {
                res.tax = Market.tax;
                res.save();
                response.json({success: true});
            }
        });
    },

    updateMarketDescription : function (Market, response) {
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
}
