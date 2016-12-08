'use strict';

var gamerHistory = require('./gamerHistory.model');


exports.getGamerHistory = function(gamerId, response) {
    gamerHistory.findOne({gamerID: gamerId}).exec(function (err,res){
        if(err){
            response.send(500, {error: err});
        } else {
            response.json({"result": "SUCCESS", "gamerHistory": res});
        }
    });
};

exports.postGamerHistory = function(GamerHistory, response) {
    gamerHistory.create(GamerHistory, function (err, res){
        if(err) {
            response.send(500, {error: err});
        } else {
            response.json({success: true});
        }
    });
};

exports.updateGamerHistory = function(GamerHistory, response) {
    gamerHistory.findOne({gamerID: GamerHistory.gamerID}).exec(function (err,res){
        if(err){
            response.send(500, {error: err});
        } else {
            res.history.push(GamerHistory.history[0]);
            res.save();
            response.json({success: true});
        }
    });
};

exports.clearGamerHistory = function (GamerID, response) {
    gamerHistory.findOne({gamerID: GamerID}).exec(function (err,res) {
        if(err) {
            response.send(500, {error: err});
        } else {
            res.history = [];
            res.save();
            response.json({success: true});
        }
    });
};
