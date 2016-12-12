'use strict';
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');

    var thing = require('./thing/thing.controller');
// things ressources
    router.get('/api/things', thing.find);
    router.get('/api/things/:id', thing.get);
    router.post('/api/things', thing.post);
    router.put('/api/things/:id', thing.put);

    var User = require('./user/user.model');
    var UserAccount = require('./user/user.controller');


    router.post('/api/register', function(req, res) {
        User.register(new User({ username: req.body.user.nickname, email: req.body.user.email, name: req.body.user.name,
        surname: req.body.user.surname, description : req.body.user.bio}),
            req.body.user.password, function(err, account) {
                if (err) {
                    return res.status(500).json({
                        err: err
                    });
                }
                req.body.username = req.body.user.nickname;
                req.body.password = req.body.user.password;
                passport.authenticate('local')(req ,res, function () {
                    return res.status(200).json({
                        status: 'Registration successful!'
                    });
                });
            });
    });

    router.post('/api/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({
                    err: info
                });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.status(500).json({
                        err: 'Could not log in user'
                    });
                }
                res.status(200).json({
                    status: 'Login successful!'
                });
            });
        })(req, res, next);
    });

    router.get('/api/logout', function(req, res) {
        req.logout();
        res.status(200).json({
            status: 'Bye!'
        });
    });

    router.get('/api/status', function(req, res) {
        if (!req.isAuthenticated()) {
            return res.status(200).json({
                status: false
            });
        }
        res.status(200).json({
            status: true
        });
    });
    /*// things ressources
    router.get('/api/users', userAccount.find);
    router.get('/api/users/:email/:password', userAccount.get);
    router.post('/api/users', userAccount.post);
    router.put('/api/users/:id', userAccount.put);*/

///GAMER
    var gamer = require('./gamer/gamer.model');
// gamer ressourses
    router.get('/gamer/:userID', function (request, response) {
        var userID = request.params.userID;
        gamer.getGamer(userID, response);
    });

    router.post('/gamer', function (request, response) {
        var Gamer = {
            userID: request.body.userID,
            name: request.body.name,
            password: request.body.password,
            date: Date.now(),
            isDev: null,
            payPalAcc: request.body.payPalAcc,
            history: [],
            wallet: []
        };
        gamer.postGamer(Gamer, response);
    });

    router.put('/gamer/wallet', function (request, response) {
        var Gamer = request.body.gamer;
        gamer.updateWallet(Gamer, response);
    });

    router.put('/gamer/payPal', function (request, response) {
        var Gamer = request.body.gamer;
        gamer.updateGamerPaypalAcc(Gamer, response);
    });

    router.put('/gamer/isDev', function (request, response) {
        var Gamer = request.body.gamer;
        gamer.updateGamerIsDev(Gamer, response);
    });

    router.delete('/history/:userID', function (request, response) {
        var userID = request.params.userID;
        gamer.clearHistory(userID, response);
    });

///MARKET
    var market = require('./market/market.model');
// market ressourses
    router.get('/market/:marketID', function (request, response) {
        var marketID = request.params.marketID;
        market.getMarket(marketID, response);
    });

    router.get('/market/:name', function (request, response) {
        market.searchMarket(request, response);
    });

    router.get('/markets', function (request, response) {
        market.getMarkets(response);
    });

    router.post('/market', function (request, response) {
        var Market = {
            devID: new ObjectId(request.body.devID),
            marketType: request.body.marketType,
            name: request.body.name,
            description: request.body.description,
            showOffers: request.body.showOffers,
            tax: request.body.tax,
            newPrice: request.body.newPrice,
            currencyType1: request.body.currencyType1,
            currencyType2: request.body.currencyType2
        };
        market.postMarket(Market, response);
    });

    router.put('/market/offers', function (request, response) {
        var Market = request.body.market;
        market.updateMarketShowOffers(Market, response);
    });

    router.put('/market/type', function (request, response) {
        var Market = request.body.market;
        market.updateMarketType(Market, response);
    });

    router.put('/market/tax', function (request, response) {
        var Market = request.body.market;
        market.updateMarketTax(Market, response);
    });

    router.put('/market/description', function (request, response) {
        var Market = request.body.market;
        market.updateMarketDescription(Market, response);
    });

///DEVELOPER
    var developer = require('./developer/developer.model');
// developer ressourses
    router.get('/developer/:devID', function (request, response) {
        var devID = request.params.devID;
        developer.getDev(devID, response);
    });

    router.post('/developer', function (request, response) {
        var Developer = {
            gamerID: new ObjectId(request.body.devID),
            name: request.body.name,
            date: Date.now(),
            picture: request.body.picture,
            telephone: request.body.telephone,
            company: request.body.company,
            payPalAcc: request.body.payPalAcc
        };
        developer.postDev(Developer, response);
    });

    router.put('/developer/telephone', function (request, response) {
        var Dev = request.body.dev;
        developer.updateDevTelephone(Dev, response);
    });

    router.put('/developer/PayPal', function (request, response) {
        var Dev = request.body.dev;
        developer.updateDevPayPalAcc(Dev, response);
    });

///MARKETBUY
    var marketBuy = require('./marketBuy/marketBuy.model');
// marketBuy ressourses
    router.get('/marketBuy/:marketID', function (request, response) {
        var MarketID = request.params.marketID;
        marketBuy.getMarketBuy(MarketID, response);
    });

    router.put('/marketBuy/tax', function (request, response) {
        var MarketBuy = request.body.marketBuy;
        marketBuy.updateTax(MarketBuy, response);
    });

    router.put('/marketBuy/marketType', function (request, response) {
        var MarketBuy = request.body.marketBuy;
        marketBuy.updateMarketType(MarketBuy, response);
    });

    router.put('/marketBuy/:userID', function (request, response) {
        var MarketBuy = request.body.marketBuy;
        var userID = request.params.userID;
        marketBuy.findUserOffer(MarketBuy, userID, response);
    });

    router.post('/marketBuy/:userID', function (request, response) {
        var MarketID = request.body.marketBuy._id;
        var userID = request.params.userID;
        var price = request.body.price;
        var amount = request.body.amount;
        marketBuy.findOrCreateOffer(MarketID, userID, price, amount, response);
    });

    router.delete('/marketBuy/:userID', function (request, response) {
        var MarketBuy = request.body.marketBuy;
        var userID = request.params.userID;
        var price = request.params.price;
        marketBuy.findAndRemoveUserOffer(MarketBuy, userID, price, response);
    });

///MARKETSELL
    var marketSell = require('./marketSell/marketSell.model');
// marketSell ressourses
    router.get('/marketSell/:marketID', function (request, response) {
        var MarketID = request.params.marketID;
        marketSell.getMarketSell(MarketID, response);
    });

    router.put('/marketSell/tax', function (request, response) {
        var MarketSell = request.body.marketSell;
        marketSell.updateTax(MarketSell, response);
    });

    router.put('/marketSell/marketType', function (request, response) {
        var MarketSell = request.body.marketSell;
        marketSell.updateMarketType(MarketSell, response);
    });

    router.put('/marketSell/:userID', function (request, response) {
        var MarketSell = request.body.marketSell;
        var userID = request.params.userID;
        marketSell.findUserOffer(MarketSell, userID, response);
    });

    router.post('/marketSell/:userID', function (request, response) {
        var MarketID = request.body.marketSell._id;
        var userID = request.params.userID;
        var price = request.body.price;
        var amount = request.body.amount;
        marketSell.findOrCreateOffer(MarketID, userID, price, amount, response);
    });

    router.delete('/marketSell/:userID', function (request, response) {
        var MarketSell = request.body.marketSell;
        var userID = request.params.userID;
        var price = request.params.price;
        marketSell.findAndRemoveUserOffer(MarketSell, userID, price, response);
    });

///SHOP
    var shop = require('./shop/shop.model');
// shop ressourses
    router.get('/shop/:shopID', function (request, response) {
        var ShopID = request.params.shopID;
        shop.getShop(ShopID, response);
    });

    router.get('/shop/:name', function (request, response) {
        shop.searchShop(request, response);
    });

    router.get('/shops', function (request, response) {
        shop.getShops(response);
    });

    router.post('/shop', function (request, response) {
        var Shop = {
            name: request.body.name,
            devID: request.body.devID,
            offers: [],
            payPalAcc: request.body.payPalAcc,
            publicHistory: request.body.publicHistory,
            history: []
        };
        shop.postShop(Shop, response);
    });

    router.put('/shop/history', function (request, response) {
        var Shop = request.body.shop;
        shop.updateShopHistory(Shop, response);
    });

    router.delete('/shop/:shopID', function (request, response) {
        var ShopID = request.params.shopID;
        shop.clearShopHistory(ShopID, response);
    });

    router.put('/shop/PayPal', function (request, response) {
        var Shop = request.body.shop;
        shop.updateShopPayPalAcc(Shop, response);
    });

    router.post('/shop/offer', function (request, response) {
        var Shop = request.body.shop;
        shop.addShopOffer(Shop, response);
    });

    router.put('/shop/offer', function (request, response) {
        var Shop = request.body.shop;
        shop.updateShopOffer(Shop, response);
    });


    router.delete('/shop/offer', function (request, response) {
        var Shop = request.body.shop;
        shop.removeShopOffer(Shop, response);
    });

///TRANSACTION
    var transaction = require('./transaction/transaction.model');
// transaction ressourses
    router.post('/transaction/buy', function (request, response) {
        var Gamer = request.body.gamer;
        transaction.MakeTransactionBuy(Gamer, response);
    });

    router.post('/transaction/sell', function (request, response) {
        var Gamer = request.body.gamer;
        transaction.MakeTransactionSell(Gamer, response);
    });

    router.post('/transaction/offer/buy', function (request, response) {
        var userID = request.body.userID;
        var cost = request.body.cost;
        var currencyType = request.body.currencyType;
        var price = request.body.price;
        var amount = request.body.amount;
        var marketID = request.body.marketID;
        transaction.MakeOfferBuy(userID, cost, currencyType, price, amount, marketID, response);
    });

    router.post('/transaction/offer/sell', function (request, response) {
        var userID = request.body.userID;
        var cost = request.body.cost;
        var currencyType = request.body.currencyType;
        var price = request.body.price;
        var amount = request.body.amount;
        var marketID = request.body.marketID;
        transaction.MakeOfferSell(userID, cost, currencyType, price, amount, marketID, response);
    });

    module.exports = router;
