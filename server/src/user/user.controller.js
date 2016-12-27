'use strict';
var user = require('./user.model.js');
var ProjectConst = require('../consts');

function historyHelper(wallet, newTransactionType) {
    var myHistory = {};
    myHistory.date = Date.now();
    myHistory.currencyType = wallet.currencyType;
    myHistory.amount = wallet.amount;
    myHistory.marketID = wallet.marketID;
    myHistory.transactionType = newTransactionType;
    return myHistory;
};

exports.find = function (req, res, next) {
    user.find(function (err, users) {
        if (err) {
            return next(err);
        }
        return res.status(200).json(users);
    });
};
exports.get = function (req, res, next) {
    user.find({
        email: req.params.email
        , password: req.params.password
    }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404).send('Not Found');
        }
        return res.status(200).json(user);
    });
};
exports.findByEmail = function (req, res, next) {
    var accountProjection = {
        __v: false
        , _id: false
    };
    user.find({
        email: req.params.email
        , password: req.params.password
    }, accountProjection, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404).send('Not Found');
        }
        return res.status(200).json(user);
    });
};
exports.post = function (req, res, next) {
    user.create(req.body, function (err, user) {
        if (err) {
            return next(err);
        }
        return res.status(201).json(user);
    });
};
exports.put = function (req, res, next) {
    user.findOneAndUpdate({
        _id: req.params.id
    }, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(404).send('Not Found');
        }
        user.save(function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).json(user);
        });
    });
};
exports.updateUserIsDev = function (User, response) {
    user.findById(User.userID).exec(function (err, res) {
        if (err) {
            response.send(500, {
                error: err
            });
        }
        else {
            console.log("try to update");
            res.isDev = User.isDev;
            res.save();
            response.json({
                success: true
            });
        }
    });
};

exports.getWallet = function (id, response) {
    user.findById({
        _id: id
    }).exec(function (err, res) {
        if (err) {
            response.status(500).send(err);
        }
        else {
            response.send({"wallet": res.wallet });
        }
    });
};

exports.updateWallet = function (User, response, newTransactionType) {
    user.findById({
        _id: User._id
    }).exec(function (err, res) {
        if (err) {
            response.status(500).send(err);
        }
        else {
            var newCurrency = true;
            for (var i = 0; i < res.wallet.length; i++) {
                if (res.wallet[i].marketID.toString() == User.wallet.marketID.toString())
                    if (res.wallet[i].currencyType == User.wallet.currencyType) {
                        console.log("update wallet!");
                        newCurrency = false;
                        res.wallet[i].amount += User.wallet.amount;
                    }
            }
            if (newCurrency) res.wallet.push(User.wallet);
            var myHistory = historyHelper(User.wallet, newTransactionType);
            res.transactions.push(myHistory);
            res.save();
        }
    });
};
exports.justCheckPayingCapacity = function (userId, currencyType, marketID, price, amount, response, callback) {
    user.findOne({
        _id: userId
    }).exec(function (err, res) {
        if (err) {
            response.send(500, {
                error: err
            });
        }
        else {
            // func1
            for (var i = 0; i < res.wallet.length; i++) {
                if (res.wallet[i].marketID.toString() == marketID.toString()) {
                    if (res.wallet[i].currencyType == currencyType) {
                        if (res.wallet[i].amount >= amount) {
                            console.log("Cool! Gamer is able to pay");
                            // make pay
                            res.wallet[i].amount -= amount;
                            // update history
                            var myWallet = {};
                            myWallet.currencyType = res.wallet[i].currencyType;
                            myWallet.marketID = res.wallet[i].marketID;
                            myWallet.amount = amount * (-1);
                            var myHistory = historyHelper(myWallet, ProjectConst.CreateOffer);
                            res.transactions.push(myHistory);
                            res.save();
                            callback(marketID, userId, price, amount, response);
                            break;
                        }
                    }
                }
            }
        }
    });
};
exports.checkPayingCapacity = function (userId, transaction, cost, currencyType, amount, currencyType2, marketID, indexOffer, response, callback) {
    user.findOne({
        _id: userId
    }).exec(function (err, res) {
        if (err) {
            response.send(500, {
                error: err
            });
        }
        else {
            // func1
            var success = false;
            var index = -1;
            for (var i = 0; i < res.wallet.length; i++) {
                if (res.wallet[i].marketID.toString() == marketID.toString()) {
                    if (index == -1)
                        index = i;
                    console.log(res.wallet[i].currencyType);
                    console.log(currencyType);
                    if (res.wallet[i].currencyType == currencyType) {
                        console.log(res.wallet[i].amount);
                        console.log(cost);
                        if (res.wallet[i].amount >= cost) {
                            console.log("Cool! Gamer is able to pay");
                            success = true;
                            // make pay
                            res.wallet[i].amount -= cost;
                            // update history
                            var myWallet = {};
                            myWallet.currencyType = res.wallet[i].currencyType;
                            myWallet.marketID = res.wallet[i].marketID;
                            myWallet.amount = cost * (-1);
                            var myHistory = historyHelper(myWallet, ProjectConst.TransactionPay);
                            res.transactions.push(myHistory);
                            if (i != index) {
                                if (res.wallet[index].currencyType == currencyType2) {
                                    // update history
                                    var myWallet2 = {};
                                    myWallet2.currencyType = res.wallet[index].currencyType;
                                    myWallet2.marketID = res.wallet[index].marketID;
                                    myWallet2.amount = amount;
                                    myHistory = historyHelper(myWallet2, ProjectConst.TransactionTake);
                                    res.transactions.push(myHistory);
                                    res.wallet[index].amount += amount;
                                }
                            }
                            else {
                                // func2
                                var notfound = true;
                                for (; i < res.wallet.length; i++) {
                                    if (res.wallet[i].currencyType == currencyType2) {
                                        // update history
                                        var myWallet3 = {};
                                        myWallet3.currencyType = res.wallet[i].currencyType;
                                        myWallet3.marketID = res.wallet[i].marketID;
                                        myWallet3.amount = amount;
                                        myHistory = historyHelper(myWallet3, ProjectConst.TransactionTake);
                                        res.transactions.push(myHistory);
                                        res.wallet[index].amount += amount;
                                        notfound = false;
                                        break;
                                    }
                                }
                                if (notfound) {
                                    var newWallet = {};
                                    newWallet.currencyType = currencyType2;
                                    newWallet.amount = amount;
                                    newWallet.marketID = marketID;
                                    myHistory = historyHelper(newWallet, ProjectConst.TransactionTake);
                                    res.transactions.push(myHistory);
                                    res.wallet.push(newWallet);
                                }
                                break;
                            }
                        }
                    }
                }
            }
            if (success) {
                res.save();
                console.log('hello bullshit');
                callback(marketID, transaction, indexOffer, amount, response);
            }
            else {
                console.log("something is wrong");
            }
        }
    })
};
exports.updateUser = function (User, response) {
    console.log("UPDATE USER");
    console.log(User);
    user.findById(User._id, function (err, user) {
        if (err) {
            console.log("ERROR");
            console.log(err);
            response.send(500, {
                error: err
            });
        }
        else {
            user.email = User.email;
            user.name = User.name;
            user.surname = User.surname;
            user.description = User.description;
            user.paypal = User.paypal;
            user.wallet = User.wallet;
            user.transactions = User.transactions;
            user.isDev = User.isDev;
            console.log("USER");
            console.log(user);
            user.save();
            response.json({
                success: true,
                user: user
            });
        }
    });
};

exports.updateUser = function(User, response) {
  console.log("UPDATE USER");
  console.log(User);
  user.findById(User._id, function(err, user) {
    if (err) {
      response.send(500, {error: err});
    } else {
      user.email = User.email;
      user.name = User.name;
      user.surname = User.surname;
      user.description = User.description;
      user.isDev = User.isDev;
      user.wallet = User.wallet;
      user.transactions = User.transactions;
      user.save();
      response.json({success: true});
    }
  })
};

exports.bullshit = function(UserId, response) {
    user.findById(UserId)
        .populate({ path : 'wallet.marketID', model : 'Market'})
        .exec(function(err, result) {
            if (err)
                response.status(500).send(err);
            response.json({success: true, result : result});
        });
}
