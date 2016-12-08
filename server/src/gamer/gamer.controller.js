'use strict';

var gamer = require('./gamer.model');


function historyHelper(wallet)
{
    var myHistory = {};
    myHistory.date = Date.now();
    myHistory.currencyType = wallet.currencyType;
    myHistory.amount = wallet.amount;
    myHistory.marketID = wallet.marketID;
    return myHistory;
}

// Gamer

exports.getGamer = function (userId, response) {
    gamer.findOne({userID: userId}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            response.json({"result": "SUCCESS", "gamer": res});
        }
    });
},

exports.postGamer = function (Gamer, response) {
    gamer.create(Gamer, function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            response.json({success: true});
        }
    });
},

exports.updateGamerPaypalAcc = function (Gamer, response) {
    gamer.findOne({userID: Gamer.userID}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            res.payPalAcc = Gamer.payPalAcc;
            res.save();
            response.json({success: true});
        }
    });
},

exports.updateGamerIsDev = function (Gamer, response) {
    gamer.findOne({userID: Gamer.userID}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            res.isDev = Gamer.isDev;
            res.save();
            response.json({success: true});
        }
    });
},

exports.clearHistory = function(UserID, response) {
    gamer.findOne({userID: UserID}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            res.history = [];
            res.save();
            response.json({success: true});
        }
    });
},

// deprecated
exports.addToWallet = function (Gamer, response) {
    gamer.findOne({userID: Gamer.userID}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            res.wallet.push(Gamer.wallet);
            res.save();
            response.json({success: true});
        }
    });
},

// add some currency
exports.updateWallet = function (Gamer, response) {
    gamer.findOne({userID: Gamer.userID}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            var newCurrency = true;
            for(var i = 0; i < res.wallet.length; i++)
            {
                if(res.wallet[i].marketID == Gamer.wallet.marketID)
                    if(res.wallet[i].currencyType == Gamer.wallet.currencyType)
                    {
                        console.log("update wallet!");
                        newCurrency = false;
                        res.wallet[i].amount += Gamer.wallet.amount;
                    }
            }
            if(newCurrency)
                res.wallet.push(Gamer.wallet);
            var myHistory = historyHelper(Gamer.wallet);
            res.history.push(myHistory);
            res.save();
        }
    });
},

// The part of Transaction methods ...

exports.justCheckPayingCapacity = function(userId, cost, currencyType, marketID, price, amount, response, callback) {
    gamer.findOne({userID: userId}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            // func1
            for (var i = 0; i < res.wallet.length; i++) {
                if (res.wallet[i].marketID == marketID) {
                    if (res.wallet[i].currencyType == currencyType) {
                        if (res.wallet[i].amount >= cost) {
                            console.log("Cool! Gamer is able to pay");
                            // make pay
                            res.wallet[i].amount -= cost;
                            // update history
                            var myWallet = res.wallet[i];
                            myWallet.amount = cost;
                            var myHistory = historyHelper(myWallet);
                            res.history.push(myHistory);
                            res.save();
                            callback(marketID, userId, price, amount, response);
                            break;
                        }
                    }
                }
            }
        }
    });
},

// after check update wallets
exports.checkPayingCapacity = function (userId, transaction, cost, currencyType, amount, currencyType2, marketID, indexOffer, response, callback) {
    gamer.findOne({userID: userId}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            // func1
            var success = false;
            var index = -1;
            for(var i = 0; i < res.wallet.length; i++)
            {
                if(res.wallet[i].marketID == marketID) {
                    if(index == -1)
                        index = i;
                    if(res.wallet[i].currencyType == currencyType) {
                        if(res.wallet[i].amount >= cost) {
                            console.log("Cool! Gamer is able to pay");
                            success = true;
                            // make pay
                            res.wallet[i].amount -= cost;
                            // update history
                            var myWallet = res.wallet[i];
                            myWallet.amount = cost;
                            var myHistory = historyHelper(myWallet);
                            res.history.push(myHistory);
                            if(i != index) {
                                if(res.wallet[index].currencyType == currencyType2) {
                                    // update history
                                    myWallet = res.wallet[index];
                                    myWallet.amount = amount;
                                    myHistory = historyHelper(myWallet);
                                    res.history.push(myHistory);
                                    res.wallet[index].amount += amount;
                                }
                            } else {
                                // func2
                                var notfound = true;
                                for(; i < res.wallet.length; i++) {
                                    if(res.wallet[i].currencyType == currencyType2) {
                                        // update history
                                        myWallet = res.wallet[i];
                                        myWallet.amount = amount;
                                        myHistory = historyHelper(myWallet);
                                        res.history.push(myHistory);
                                        res.wallet[index].amount += amount;
                                        notfound = false;
                                        break;
                                    }
                                }
                                if(notfound) {
                                    var newWallet = {};
                                    newWallet.currencyType = currencyType2;
                                    newWallet.amount = amount;
                                    newWallet.marketID = marketID;
                                    myHistory = historyHelper(myWallet);
                                    res.history.push(myHistory);
                                    res.wallet.push(newWallet);
                                }
                                break;
                            }
                        }
                    }
                }
            }
            if(success) {
                res.save();
                callback(marketID, transaction, indexOffer, amount, response);
            }
        }
    });
}
