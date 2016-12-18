'use strict';

var market = require('./market.model');

exports.getMarket = function(marketId, response) {
  market.findOne({
    _id: new ObjectId(marketId)
  }).exec(function(err, res) {
    if (err) {
      response.send(500, {
        error: err
      });
    } else {
      response.json({
        "result": "SUCCESS",
        "market": res
      });
    }
  });
};

exports.searchMarket = function(request, response) {
  market.find({
    name: request.params.name
  }).exec(function(err, res) {
    if (err) {
      response.send(500, {
        error: err
      });
    } else {
      response.json({
        "result": "SUCCESS",
        "market": res
      });
    }
  });
};

exports.getMarketsByDevID = function(request, response) {
  market.find({
    devID: request.params.devID
  }).exec(function(err, res) {
    if (err) {
      response.send(500, {
        error: err
      });
    } else {
      response.json({
        "result": "SUCCESS",
        "markets": res
      });
    }
  });
};

exports.getMarkets = function(response) {
  market.find().exec(function(err, res) {
    response.json({
      "result": "SUCCESS",
      "markets": res
    });
  });
};

exports.postMarket = function(Market, response) {
  market.create(Market, function(err, res) {
    if (err) {
      response.send(500, {
        error: err
      });
    } else {
      response.json({
        success: true
      });
    }
  });
};

exports.updateMarketShowOffers = function(Market, response) {
  market.findOne({
    _id: Market._id
  }).exec(function(err, res) {
    if (err) {
      response.send(500, {
        error: err
      });
    } else {
      res.showOffers = Market.showOffers;
      res.save();
      response.json({
        success: true
      });
    }
  });
};

exports.updateMarketType = function(Market, response) {
  market.findOne({
    _id: Market._id
  }).exec(function(err, res) {
    if (err) {
      response.send(500, {
        error: err
      });
    } else {
      res.marketType = Market.marketType;
      res.save();
      response.json({
        success: true
      });
    }
  });
};

exports.updateMarketTax = function(Market, response) {
  market.findOne({
    _id: Market._id
  }).exec(function(err, res) {
    if (err) {
      response.send(500, {
        error: err
      });
    } else {
      res.tax = Market.tax;
      res.save();
      response.json({
        success: true
      });
    }
  });
};

exports.updateMarketDescription = function(Market, response) {
  market.findOne({
    _id: Market._id
  }).exec(function(err, res) {
    if (err) {
      response.send(500, {
        error: err
      });
    } else {
      res.description = Market.description;
      res.save();
      response.json({
        success: true
      });
    }
  });
}
