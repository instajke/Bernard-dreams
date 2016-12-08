'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var gamerHistorySchema = new Schema ({
    gamerID: Schema.Types.ObjectId,
    history: [{ currencyType1: String, amount1: Number,
        currencyType2: String, amount2: Number, date: { type: Date, default: Date.now() }}]
});

var gamerHistory = mongoose.model('GamerHistory', gamerHistorySchema);

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
