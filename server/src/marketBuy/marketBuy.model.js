'use strict';

var userLogic = require('../user/user.logic');
var myConst = require('../consts');
var sellHelper = require('../sellIllusiveHelper');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var marketBuySchema = new Schema ({
    marketID: Schema.Types.ObjectId,
    marketName: String,
    devID: String,
    marketType: String,
    taxes: Number,
    currencyAnother: String,
    currencyTypeBuy: String,
    bestPrice: Number,
    curBuyings: Number, // if(curBuyings > newPrice) -> price changes in illusive markets
    newPrice: Number, // for illusive markets
    offers: [ { price: Number, amount: Number, offersInPrice: [ { amount: Number, userID: Schema.Types.ObjectId }] }],
    graphicBuy: [{ price: Number, date: { type: Date, default: Date.now() }}]  // price changing in a market
});

var marketBuy  = mongoose.model('MarketBuy', marketBuySchema);


exports.getMarketBuy = function(devID, response) {
    marketBuy.find({devID: devID}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            response.json({"result": "SUCCESS", "marketBuys": res});
        }
    });
};

exports.getMarketBuysByMarketIds = function (marketIdArray, response) {
    marketIdArray.forEach(function(item) {
        item = Schema.Types.ObjectId(item);
    });

    marketBuy.find( { marketID : { $in : marketIdArray }}, function (err, docs) {
        response.json({"result" : "SUCCESS", "markets" : docs});
    })
};

exports.postMarketBuy = function(MarketBuy) {
    if(MarketBuy.marketType == myConst.SimulatedMarket) {
        var devOffer = {};
        devOffer.price = 1;
        devOffer.amount = 1000000000;
        devOffer.offersInPrice = [];
        MarketBuy.offers.push(devOffer);
    }
    
    marketBuy.create(MarketBuy, function (err, res){
        if(err) {
            console.warn(err);
        } else {
            console.warn("Success");
        }
    });
};

exports.updatePriceInSimulatedMarket = function (MarketID, price, response) {
    marketBuy.findOne({marketID: MarketID}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            res.offers[0].price = price;
            res.save();
            response.send({"result": "changed"});
        }
    });
};

exports.updateEntireMarket = function (Market, response) {

    marketBuy.findOneAndUpdate({_id : Market._id}, Market, function (err, res) {
        if (err)
            response.status(500).send(err);
        else {
            res.save();
            response.json({success: true});
        }
    });
};

exports.updateTax = function(Market, response) {
    marketBuy.findOne({marketID: Market._id}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            res.tax = Market.tax;
            res.save();
        }
    });
};

exports.updateMarketType = function(Market, response) {
    marketBuy.findOne({marketID: Market._id}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            res.marketType = Market.marketType;
            res.save();
        }
    });
};

exports.findUserOffer = function(Market, userId, response) {
    marketBuy.findOne({marketID: Market._id}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            var found = false;
            var offers = [];
            for(var i = 0; i < res.offers.length; i++) {
                for(var j = 0; j < res.offers[i].offersInPrice.length; j++) {
                    if(res.offers[i].offersInPrice[j].userID.toString() == userId.toString())
                    {
                        found = true;
                        console.log("found offer");
                        var userOffer = res.offers[i].offersInPrice[j];
                        userOffer.price = res.offers[i].price;
                        offers.push(userOffer);
                    }
                }
            }
            if(found)
                response.json({"result": "SUCCESS", "userOffer": offers});
            else
                response.json({"Result": "Not found"});
        }
    });
};

exports.findOrCreateOffer = function(MarketID, userId, price, amount, response) {
    marketBuy.findOne({marketID: MarketID}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            if(res.marketType == myConst.RealMarket) {
                var found = false;
                if(res.bestPrice == null) {
                    res.bestPrice = price;
                    var point = {};
                    point.price = price;
                    point.date = Date.now();
                    res.graphicBuy.push(point);
                    
                } else if (price < res.bestPrice) {
                    res.bestPrice = price;
                    var point = {};
                    point.price = price;
                    point.date = Date.now();
                    res.graphicBuy.push(point);
                }
                for (var i = 0; i < res.offers.length; i++) {
                    if (res.offers[i].price == price) {
                        for (var j = 0; j < res.offers[i].offersInPrice.length; j++) {
                            if (res.offers[i].offersInPrice[j].userID.toString() == userId.toString()) {
                                console.log("found offer");
                                found = true;
                                res.offers[i].offersInPrice[j].amount += amount;
                                res.offers[i].amount += amount;
                                break;
                            }
                        }
                        if (!found) {
                            var myOffer = {};
                            myOffer.amount = amount;
                            myOffer.userID = userId;
                            res.offers[i].offersInPrice.push(myOffer);
                            res.offers[i].amount += amount;
                            found = true;
                        }
                        break;
                    }
                }
                if (!found) {
                    var offers = {};
                    offers.price = price;
                    offers.amount = amount;
                    offers.offersInPrice = [];
                    var offer = {};
                    offer.amount = amount;
                    offer.userID = userId;
                    offers.offersInPrice.push(offer);
                    res.offers.push(offers);
                    console.log("create offer");
                }
                res.save();
                response.json({success: true});
            } else {
                response.send({"result": "Wrong market"});
            }
        }
    });
};

exports.findAndRemoveUserOffer = function(Market, userId, price, response) {
    marketBuy.findOne({marketID: Market._id}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            var found = false;
            for(var i = 0; i < res.offers.length; i++) {
                if (res.offers[i].price == price) {
                    for (var j = 0; j < res.offers[i].offersInPrice.length; j++) {
                        if (res.offers[i].offersInPrice[j].userID.toString() == userId.toString()) {
                            console.log("found offer");
                            found = true;
                            var mygamer = {};
                            mygamer.userID = userId;
                            mygamer.wallet = {};
                            mygamer.wallet.amount = res.offers[i].offersInPrice[j].amount;
                            mygamer.wallet.marketID = Market._id;
                            mygamer.wallet.currencyType = res.currencyTypeBuy;
                            userLogic.UpdateWallet(mygamer, response, myConst.CancelOffer);
                            if(res.offers[i].offersInPrice[j].amount == res.offers[i].amount){
                                if(res.bestPrice == res.offers[i].price) {
                                    res.offers.splice(i, 1);
                                    var newPrice = Infinity;
                                    for(i = 0; i < res.offers.length; i++)
                                    {
                                        if(newPrice > res.offers[i].price)
                                        {
                                            newPrice = res.offers[i].price;
                                        }
                                    }
                                    res.bestPrice = newPrice;
                                    var point = {};
                                    point.price = newPrice;
                                    point.date = Date.now();
                                    res.graphicBuy.push(point);
                                } else {
                                    res.offers.splice(i, 1);
                                }
                            } else {
                                res.offers[i].offersInPrice.splice(j, 1);
                            }
                            res.save();
                            response.json({success: true});
                            break;
                        }
                    }
                }
                break;
            }
            if(!found)
                response.json({"Result": "Not found"});
        }
    });
};

// transactions methods

exports.UpdatePriceIllusive = function(marketId, newPercent, response) {
    marketBuy.findOne({marketID: marketId}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            var tempPercent = newPercent;
            var price = res.offers[0].price;
            if (res.offers[0].price  > myConst.CrucialPoint)
            {
                price = parseFloat((res.offers[0].price * (1 - parseFloat(newPercent) / 100)).toFixed(myConst.MaxDigits));
            } else { 
                while(tempPercent > 0) {
                    if (res.offers[0].price > Math.random()) {
                        price -= myConst.MinPriceUp;
                    }
                    tempPercent--;
                }
                price = parseFloat(price.toFixed(myConst.MaxDigits));
            }
            if(price < myConst.BottomPrice)
                price = myConst.BottomPrice;
            res.offers[0].price = price;
            res.bestPrice = price;
            var point = {};
            point.price = price;
            point.date = Date.now();
            res.graphicBuy.push(point);
            console.log("graph and price are updated! Again!");
            res.save();
        }
    });
};

exports.checkPriceBuy = function(gamer, desirePrice, response, callbackGamer, callbackMarketUpdate) {
    var message = '';
    marketBuy.findOne({marketID: gamer.wallet.marketID}).exec(function (err, res) {
        if(err){
            response.send(500, {error: err});
        } else {
            var transaction = false;
            for(var i = 0; i < res.offers.length; i++)
            {
                if(res.offers[i].price == desirePrice)
                {
                    var index = i;
                    var cost = 0;
                    console.log("Cool! Transaction is possible! price is found");
                    if(res.offers[i].amount > gamer.wallet.amount) {
                        // calculate cost
                        cost = gamer.wallet.amount * desirePrice;
                        cost += ((parseFloat(res.taxes) / 100) * cost);
                        console.log("Cool! It will be full transaction!");
                        // checkPaying capacity
                        callbackGamer(gamer.userID, myConst.TransactionSucces, cost, res.currencyAnother, gamer.wallet.amount,
                            res.currencyTypeBuy, res.marketID, i, response, callbackMarketUpdate);
                    } else {
                        // calculate cost
                        var isPartial = true;
                        if(res.offers[i].amount == gamer.wallet.amount)
                            isPartial = false;
                        cost = res.offers[i].amount * desirePrice;
                        cost += ((parseFloat(res.taxes) / 100) * cost);
                        //res.offers.remove(i);
                        if(isPartial) {
                            console.log("Not Cool! It will pe partial transaction!");
                            callbackGamer(gamer.userID, myConst.TransactionPartialSuccess, cost, res.currencyAnother, gamer.wallet.amount,
                                res.currencyTypeBuy, res.marketID, i, response, callbackMarketUpdate);
                        } else {
                            console.log("Cool! It will be full transaction, but it needs updates!");
                            callbackGamer(gamer.userID, myConst.TransactionSuccesWithUpdates, cost, res.currencyAnother, gamer.wallet.amount,
                                res.currencyTypeBuy, res.marketID, i, response, callbackMarketUpdate);
                        }
                    }
                    transaction = true;
                    break;
                }
            }
            res.save();
            if(!transaction) {
                console.log("Not cool at all! Transaction failed.");
                response.json({"result": myConst.TransactionFailed, "PriceIsChanged": res.bestPrice});
            }
        }
    });
};

exports.UpdateMarket = function(MarketID, transaction, index, newAmount, response) {
    marketBuy.findOne({marketID: MarketID}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            if(res.marketType == myConst.RealMarket)
            {
                // update offers
                var myOffers = [];
                var amount = newAmount;
                var completedOfferCounter = 0;
                for(var i = 0; i < res.offers[index].offersInPrice.length; i++)
                {
                    if(res.offers[index].offersInPrice[i].amount < amount)
                    {
                        amount -= res.offers[index].offersInPrice[i].amount;
                        var myOffer1 = {};
                        myOffer1.amount = res.offers[index].offersInPrice[i].amount * res.offers[index].price;
                        myOffer1.userID = res.offers[index].offersInPrice[i].userID;
                        myOffers.push(myOffer1);
                        //res.offers[index].offersInPrice.splice(i, 1);
                        completedOfferCounter++;
                    } else {
                        var myOffer2 = {};
                        myOffer2.amount = amount * res.offers[index].price;
                        myOffer2.userID = res.offers[index].offersInPrice[i].userID;
                        myOffers.push(myOffer2);
                        if(res.offers[index].offersInPrice[i].amount == amount)
                            completedOfferCounter++;  //res.offers[index].offersInPrice.splice(i, 1);
                        else
                            res.offers[index].offersInPrice[i].amount -= amount;
                        break;
                    }
                }
                if(completedOfferCounter != 0)
                    res.offers[index].offersInPrice.splice(0, completedOfferCounter);
                console.log("offers are updated!");
                // update wallets
                var myGamer = {};
                var wallet = {};
                wallet.currencyType = res.currencyAnother;
                wallet.marketID = MarketID;
                myGamer.wallet = wallet;
                // need to update price
                if(transaction != myConst.TransactionSucces)
                {
                    res.offers.splice(index, 1);
                    // findnewprice
                    var newPrice = Infinity;
                    for(i = 0; i < res.offers.length; i++)
                    {
                        if(newPrice > res.offers[i].price)
                        {
                            newPrice = res.offers[i].price;
                        }
                    }
                    res.bestPrice = newPrice;
                    //update graph
                    var point = {};
                    point.price = newPrice;
                    point.date = Date.now();
                    res.graphicBuy.push(point);
                } else {
                    res.offers[index].amount -= newAmount;
                }
                userLogic.UpdateWallets(myGamer, myOffers, response, myConst.ExecuteOffer);

            }
            if(res.marketType == myConst.SimulatedMarket)
            {
                if(transaction != myConst.TransactionSucces)
                    console.log("Wtf is happened!");
                res.curBuyings += newAmount;
                var percent = 0;
                while(res.curBuyings > res.newPrice) {
                    res.curBuyings -= res.newPrice;
                    percent++;
                }
                if(percent != 0) {
                    if(percent > myConst.MaxPercent)
                        percent = myConst.MaxPercent;
                    var price = res.offers[0].price;
                    var tempPercent = percent;
                    if (res.offers[0].price  >= myConst.CrucialPoint)
                    {
                        price = parseFloat((res.offers[0].price * (1 + parseFloat(percent) / 100)).toFixed(myConst.MaxDigits));
                    } else {
                        while(tempPercent > 0) {
                            if (res.offers[0].price > Math.random()) {
                                price += myConst.MinPriceUp;
                            }
                            tempPercent--;
                        }
                        price = parseFloat(price.toFixed(myConst.MaxDigits));
                    }
                    res.offers[0].price = price;
                    res.bestPrice = price;
                    var point = {};
                    point.price = price;
                    point.date = Date.now();
                    res.graphicBuy.push(point);
                    sellHelper.updateIllusivePrice(MarketID, percent, response);
                }
            }
            res.save();
            response.json({ "Result": transaction });
        }
    });
};
