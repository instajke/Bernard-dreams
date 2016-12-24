'use strict';
    var express = require('express');
    var router = express.Router();
    var passport = require('passport');
    var mongoose = require('mongoose').set('debug', true);
    var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;
var path = require('path');


    var thing = require('./thing/thing.controller');
// things ressources
    router.get('/api/things', thing.find);
    router.get('/api/things/:id', thing.get);
    router.post('/api/things', thing.post);
    router.put('/api/things/:id', thing.put);

    var User = require('./user/user.model');
    var UserControl = require('./user/user.controller');

    // Home
    router.get('/', function (req, res){
        res.sendFile('index.html');
    });



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

    router.get('/api/user/:username', function (req, res) {
        User.findOne({ username : req.params.username }, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    });

    router.get('/api/usersshop/:userId', function (req, res) {
        UserControl.bullshit(req.params.userId, res);
        console.log(res);
    });

    router.post('/api/user', function (request, response) {
        var NewUser = request.body.user;
        console.log(NewUser);
        UserControl.updateUser(NewUser, response);
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

    router.get('/api/facebook', function authenticateFacebook (req, res, next) {
            req.session.returnTo = '/#' + '/account/home';
            next ();
        },
        passport.authenticate ('facebook'));

    router.get('/api/facebook/callback', function (req, res, next) {
        var authenticator = passport.authenticate ('facebook', {
            successRedirect: '/#/account/home',
            failureRedirect: '/'
        });

        delete req.session.returnTo;
        authenticator (req, res, next);
    });

    router.get('/api/google', function authenticateGoogle (req, res, next) {
            req.session.returnTo = '/#' + '/account/home';
            next ();
        },
        passport.authenticate ('google', { scope : ['profile', 'email'] }));

    router.get('/api/google/callback', function (req, res, next) {
        var authenticator = passport.authenticate ('google', {
            successRedirect: req.session.returnTo,
            failureRedirect: '/'
        });

        delete req.session.returnTo;
        authenticator (req, res, next);
    });

    router.get('/api/twitter', function authenticateTwitter (req, res, next) {
            req.session.returnTo = '/#' + '/account/home';
            next ();
        },
        passport.authenticate ('twitter'));

    router.get('/api/twitter/callback', function (req, res, next) {
        var authenticator = passport.authenticate ('twitter', {
            successRedirect: req.session.returnTo,
            failureRedirect: '/'
        });

        delete req.session.returnTo;
        authenticator (req, res, next);
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

    router.get('/api/getAuthUser', function(req,res) {
        console.log(req.user);
        res.send(req.isAuthenticated() ? req.user : '0');
    });



    router.put('/api/paypal', function (request, response) {
      var query = { username : request.body.user.nickname };
      console.log(request);
      User.update(query, { paypal : request.body.user.paypal }, {new : true}, function (err, res) {
          if (err) {
              response.send(500, {error: err});
          } else {
              response.json({success: true});
          }
      });
    });

    router.put('/api/isDev', function (request, response) {
      var query = { username : request.body.user.nickname };
      User.update(query, { isDev : true }, {new : true}, function (err, res) {
          if (err) {
              response.send(500, {error: err});
          } else {
              response.json({success: true});
          }
      });
    });



///MARKET
    var market = require('./market/market.model');
// market ressourses

    router.get('/api/market/:marketID', function (request, response) {
        var marketID = request.params.marketID;
        market.getMarket(marketID, response);
    });

    router.get('/api/market/:name', function (request, response) {
        market.searchMarket(request, response);
    });

    router.get('/api/markets/:devID', function (request, response) {
        var devID = request.params.devID;
        market.getMarketsByDevId(request, response);
    });

    router.get('/api/markets', function (request, response) {
        market.getMarkets(response);
    });

    router.post('/api/market', function (request, response) {
        var Market = {
            devID: request.body.market.devID,
            marketType: request.body.market.marketType,
            name: request.body.market.name,
            description: request.body.market.description,
            showOffers: request.body.market.showOffers,
            tax: request.body.market.tax,
            newPrice: request.body.market.newPrice,
            currencyType1: request.body.market.currencyType1,
            currencyType2: request.body.market.currencyType2
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

    router.put('/api/market', function (request, response) {
        var Market = request.body.market;
        market.updateMarket(Market, response);
    });

    router.get('/api/gamermarkets/:usedID', function(request, response) {
        console.log("GAMER MARKETS REQUEST");
        console.log(request);
        User.findOne({ username : "u" }, function(err, user) {
            console.log("we found user");
            console.log(user);
            if (err)
                res.send(err);
            market.getMarketsConnectedToUser(user, response);
        });
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
            //gamerID: new ObjectId(request.body.devID),
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
    router.get('/api/marketBuy/:devID', function (request, response) {
        var DevID = request.params.devID;
        marketBuy.getMarketBuy(DevID, response);
    });

    router.post('/api/marketBuys/', function (request, response) {
        var marketIdArray = request.body;
        console.log("MarketID array");
        console.log(marketIdArray);
        marketBuy.getMarketBuysByMarketIds(marketIdArray, response);
    });

    router.put('/api/marketBuy', function (request, response) {
        var MarketBuy = request.body.market;
        marketBuy.updateEntireMarket(MarketBuy, response);
    });

    router.put('/api/marketBuy/tax', function (request, response) {
        var MarketBuy = request.body.marketBuy;
        marketBuy.updateTax(MarketBuy, response);
    });

    router.put('/api/marketBuy/marketType', function (request, response) {
        var MarketBuy = request.body.marketBuy;
        marketBuy.updateMarketType(MarketBuy, response);
    });

    router.put('/api/marketBuy/:userID', function (request, response) {
        var MarketBuy = request.body.marketBuy;
        var userID = request.params.userID;
        marketBuy.findUserOffer(MarketBuy, userID, response);
    });

    router.post('/api/marketBuy/:userID', function (request, response) {
        var MarketID = request.body.marketBuy._id;
        var userID = request.params.userID;
        var price = request.body.price;
        var amount = request.body.amount;
        marketBuy.findOrCreateOffer(MarketID, userID, price, amount, response);
    });

    router.delete('/api/marketBuy/:userID', function (request, response) {
        var MarketBuy = request.body.marketBuy;
        var userID = request.params.userID;
        var price = request.body.price;
        marketBuy.findAndRemoveUserOffer(MarketBuy, userID, price, response);
    });

///MARKETSELL
    var marketSell = require('./marketSell/marketSell.model');
// marketSell ressourses
    router.get('/api/marketSell/:devID', function (request, response) {
        var DevID = request.params.devID;
        marketSell.getMarketSell(DevID, response);
    });

    router.post('/api/marketSells', function (request, response) {
        var marketIdArray = request.body;
        console.log("MarketID array");
        console.log(marketIdArray);
        marketSell.getMarketSellsByMarketIds(marketIdArray, response);
    });

    router.put('/api/marketSell', function (request, response) {
        var MarketSell = request.body.market;
        marketSell.updateEntireMarket(MarketSell, response);
    });

    router.put('/api/marketSell/tax', function (request, response) {
        var MarketSell = request.body.marketSell;
        marketSell.updateTax(MarketSell, response);
    });

    router.put('/api/marketSell/marketType', function (request, response) {
        var MarketSell = request.body.marketSell;
        marketSell.updateMarketType(MarketSell, response);
    });

    router.put('/api/marketSell/:userID', function (request, response) {
        var MarketSell = request.body.marketSell;
        var userID = request.params.userID;
        marketSell.findUserOffer(MarketSell, userID, response);
    });

    router.post('/api/marketSell/:userID', function (request, response) {
        var MarketID = request.body.marketSell._id;
        var userID = request.params.userID;
        var price = request.body.price;
        var amount = request.body.amount;
        marketSell.findOrCreateOffer(MarketID, userID, price, amount, response);
    });

    router.delete('/api/marketSell/:userID', function (request, response) {
        var MarketSell = request.body.marketSell;
        var userID = request.params.userID;
        var price = request.body.price;
        marketSell.findAndRemoveUserOffer(MarketSell, userID, price, response);
    });

///SHOP
    var shop = require('./shop/shop.model');
// shop ressourses
    //router.get('/api/shop/:shopID', function (request, response) {
    //    var ShopID = request.params.shopID;
    //    shop.getShop(ShopID, response);
    //});

    router.get('/api/shop/:marketID', function(request, response) {
        console.log("Get shop mark id");
        var marketID = request.params.marketID;
        shop.getShopByMarketId(marketID, response);
    });

    //router.get('/api/shop/:name', function (request, response) {
    //    shop.searchShop(request, response);
    //});

    router.get('/api/shops', function (request, response) {
        shop.getShops(response);
    });

    router.get('/api/shops/:devID', function (request, response) {
        var devID = request.params.devID;
        shop.getShopsByDevId(request, response);
    });

    router.post('/api/shops/', function (request, response) {
        var marketIdArray = request.body;
        console.log("MarketID array");
        console.log(marketIdArray);
        shop.findShopsByMarketId(marketIdArray, response);
    });


    router.post('/api/shop', function (request, response) {
        var Shop = {
            devID: request.body.shop.devID,
            name: request.body.shop.name,
            marketID: request.body.shop.marketID,
            offers: [],
            payPalAcc: request.body.shop.payPalAcc,
            publicHistory: request.body.shop.publicHistory,
            history: []
        };
        shop.postShop(Shop, response);
    });

    router.put('/api/shop/history', function (request, response) {
        var Shop = request.body.shop;
        shop.updateShopHistory(Shop, response);
    });

    router.delete('/api/shop/:shopID', function (request, response) {
        var ShopID = request.params.shopID;
        shop.clearShopHistory(ShopID, response);
    });

    router.put('/api/shop/PayPal', function (request, response) {
        var Shop = request.body.shop;
        shop.updateShopPayPalAcc(Shop, response);
    });

    router.post('/api/shop/offer', function (request, response) {
        var Shop = request.body.shop;
        shop.addShopOffer(Shop, response);
    });

    router.put('/api/shop/offer', function (request, response) {
        var Shop = request.body.shop;
        var Offer = request.body.offer;
        shop.updateShopOffer(Shop, Offer, response);
    });


    router.delete('/api/shop/offer/:shopID/:offerID', function (request, response) {
        console.log("REMOVE OFFER");
        console.log(request);
        var ShopID = request.params.shopID;
        var OfferID = request.params.offerID;
        shop.removeShopOffer(ShopID, OfferID, response);
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

    var myPayPal = require('./paypal/paypal.model');



    router.get('/api/paypal/approve', function (request, response) {
        // test data
        /*var marketID = "585d52025cf76a2e2c949832";
        var Offer = {};
        Offer.price = 0.1;
        Offer.discount = 0;
        Offer.currencyType = "Gems";
        Offer.amount = 100;
        var devPayPalAcc = "arseniy-sell@gmail.com";
        var userID = "585d0ff0097b320eccc5419c";*/
        var marketID = request.body.marketID;
        var Offer = request.body.offer;
        var devPayPalAcc = request.body.paypal;
        var userID = request.body._id;
        // a bit dangerous here without parsing...
        var price = Offer.price - (parseFloat(Offer.price) * Offer.discount / 100);
        var total = price * Offer.amount;
        myPayPal.createPayment(marketID, Offer, devPayPalAcc, price, total, userID, response);
    });

    router.get('/api/paypal/complete', function (request, response) {
        var PayerID = request.query.PayerID;
        var PaymentID = request.query.paymentId;
        myPayPal.executePayment(PaymentID, PayerID, response);
    });

    // catch 404 and forward to error handler
    router.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    module.exports = router;
