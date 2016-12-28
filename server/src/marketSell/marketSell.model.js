'use strict';

var userLogic = require('../user/user.logic');
var myConst = require('../consts');
var buyHelper = require('../buyIllusiveHelper');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// taxes only for instant buy

var marketSellSchema = new Schema ({
    marketID: Schema.Types.ObjectId,
    marketName: String,
    devID: String,
    marketType: String,
    taxes: Number,
    currencyTypeSell: String,
    currencyTypeAnother: String,
    bestPrice: Number,
    curBuyings: Number, // if(curBuyings > newPrice) -> price changes in illusive markets
    newPrice: Number, // for illusive markets
    offers: [ { price: Number, amount: Number, offersInPrice: [ { amount: Number, userID: Schema.Types.ObjectId }] }],
    graphicSell: [{ price: Number, date: { type: Date, default: Date.now() }}] // price changing in a market
});


var marketSell = mongoose.model('MarketSell', marketSellSchema);

exports.getMarketSell = function(devID, response) {
    marketSell.find({devID: devID}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            response.json({"result": "SUCCESS", "marketSells": res});
        }
    });
};

exports.getMarketSellsByMarketIds = function (marketIdArray, response) {
    marketIdArray.forEach(function(item) {
        item = Schema.Types.ObjectId(item);
    });

    marketSell.find( { marketID : { $in : marketIdArray }}, function (err, docs) {
        response.json({"result" : "SUCCESS", "markets" : docs});
    })
};

exports.postMarketSell = function(MarketSell) {
    if(MarketSell.marketType == myConst.SimulatedMarket) {
        var devOffer = {};
        devOffer.price = 1;
        devOffer.amount = Infinity;
        devOffer.offersInPrice = [];
        MarketSell.offers.push(devOffer);
    }

    marketSell.create(MarketSell, function (err, res){
        if(err) {
            console.warn(err);
        } else {
            console.warn("Success");
        }
    });
};

exports.updatePriceInSimulatedMarket = function (MarketID, price, response) {
    marketSell.findOne({marketID: MarketID}).exec(function (err,res) {
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

    marketSell.findOneAndUpdate({_id : Market._id}, Market, function (err, res) {
        if (err)
            response.status(500).send(err);
        else {
            res.save();
            response.json({success: true});
        }
    });
};

exports.updateTax = function(Market, response) {
    marketSell.findOne({marketID: Market._id}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            res.tax = Market.tax;
            res.save();
        }
    });
};

exports.updateMarketType = function(Market, response) {
    marketSell.findOne({marketID: Market._id}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            res.marketType = Market.marketType;
            res.save();
        }
    });
};

exports.findUserOffer = function(Market, userId, response) {
    marketSell.findOne({marketID: Market._id}).exec(function (err,res) {
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
    marketSell.findOne({marketID: MarketID}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            if(res.marketType == myConst.RealMarket) {
                var found = false;
                if(res.bestPrice == null) {
                    res.bestPrice = price;
                } else if (price < res.bestPrice) {
                    res.bestPrice = price;
                }
                for (var i = 0; i < res.offers.length; i++) {
                    if (res.offers[i].price == price) {
                        console.log("found offer with price");
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
    marketSell.findOne({marketID: Market._id}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            var found = false;
            for(var i = 0; i < res.offers.length; i++) {
                if(res.offers[i].price == price) {
                    for (var j = 0; j < res.offers[i].offersInPrice.length; j++) {
                        if (res.offers[i].offersInPrice[j].userID.toString() == userId.toString()) {
                            console.log("found offer");
                            found = true;
                            var mygamer = {};
                            mygamer.userID = userId;
                            mygamer.wallet = {};
                            mygamer.wallet.amount = res.offers[i].offersInPrice[j].amount;
                            mygamer.wallet.marketID = Market._id;
                            mygamer.wallet.currencyType = res.currencyTypeSell;
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

exports.UpdatePriceIllusive = function(marketId, percent, response) {
    marketSell.findOne({marketID: marketId}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            var price = res.offers[0].price * (1 - parseFloat(percent) / 100);
            res.offers[0].price = price;
            res.bestPrice = price;
            var point = {};
            point.price = price;
            point.date = Date.now();
            res.graphicSell.push(point);
            console.log("graph and price are updated! Again!");
            res.save();
        }
    });
};

exports.checkPriceSell = function(gamer, desirePrice, response, callbackGamer, callbackMarketUpdate) {
    marketSell.findOne({marketID: gamer.wallet.marketID}).exec(function (err, res) {
        if(err){
            response.send(500, {error: err});
        } else {
            var transaction = false;
            console.log("IT'S HERE SUKA");
            console.log(res);
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
                        console.log(cost + 'this is cost');
                        console.log("Cool! It will be full transaction!");
                        // checkPaying capacity
                        callbackGamer(gamer.userID, myConst.TransactionSucces, cost, res.currencyTypeAnother, gamer.wallet.amount,
                            res.currencyTypeSell, res.marketID, i, response, callbackMarketUpdate);
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
                            callbackGamer(gamer.userID, myConst.TransactionPartialSuccess, cost, res.currencyTypeAnother, gamer.wallet.amount,
                                res.currencyTypeSell, res.marketID, i, response, callbackMarketUpdate);
                        } else {
                            console.log("Cool! It will be full transaction, but it needs updates!");
                            callbackGamer(gamer.userID, myConst.TransactionSuccesWithUpdates, cost, res.currencyTypeAnother, gamer.wallet.amount,
                                res.currencyTypeSell, res.marketID, i, response, callbackMarketUpdate);
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
    marketSell.findOne({marketID: MarketID}).exec(function (err,res) {
        if(err){
            response.send(500, {error: err});
        } else {
            if(res.marketType == myConst.RealMarket)
            {
                // update offers
                var amount = newAmount;
                var myOffers = [];
                for(var i = 0; i < res.offers[index].offersInPrice.length; i++)
                {
                    console.log("Kotletka goes deeper");
                    if(res.offers[index].offersInPrice[i].amount < amount)
                    {
                        amount -= res.offers[index].offersInPrice[i].amount;
                        var myOffer1 = {};
                        myOffer1.amount = res.offers[index].offersInPrice[i].amount * res.offers[index].price;
                        myOffer1.userID = res.offers[index].offersInPrice[i].userID;
                        myOffers.push(myOffer1);
                        res.offers[index].offersInPrice.splice(i, 1);
                        console.log("Kotletka is here!");
                    } else {
                        var myOffer2 = {};
                        myOffer2.amount = amount * res.offers[index].price;
                        myOffer2.userID = res.offers[index].offersInPrice[i].userID;
                        myOffers.push(myOffer2);
                        console.log("Kotletka is here too!");
                        if(res.offers[index].offersInPrice[i].amount == amount)
                            res.offers[index].offersInPrice.splice(i, 1);
                        else
                            res.offers[index].offersInPrice[i].amount -= amount;
                    }
                }
                console.log("offers are updated!");
                // update wallets
                var myGamer = {};
                var wallet = {};
                wallet.currencyType = res.currencyTypeAnother;
                wallet.marketID = MarketID;
                myGamer.wallet = wallet;
                console.log('this is');
                console.log(myGamer);
                console.log("Kotletka Offers");
                console.log(myOffers);
                console.log('bullshit');

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
                    res.graphicSell.push(point);
                } else {
                    res.offers[index].amount -= amount;
                }
                userLogic.UpdateWallets(myGamer, myOffers, response, myConst.ExecuteOffer);

            }
            if(res.marketType == myConst.SimulatedMarket)
            {
                if(transaction != myConst.TransactionSucces)
                    console.log("Wtf is happened!");
                res.curBuyings += amount;
                var percent = 0;
                while(res.curBuyings > res.newPrice) {
                    res.curBuyings -= res.newPrice;
                    percent++;
                }
                if(percent != 0) {
                    var price = res.offers[0].price * (1 + parseFloat(percent) / 100);
                    res.offers[0].price = price;
                    res.bestPrice = price;
                    point = {};
                    point.price = price;
                    point.date = Date.now();
                    res.graphicSell.push(point);
                    console.log("graph and price are updated!");
                    buyHelper.updateIllusivePrice(MarketID, percent, response);
                }
            }
            res.save();
            response.json({ "Result": transaction });
        }
    });
};
