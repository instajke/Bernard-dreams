'use strict';

var mongoose = require('mongoose');
//var logic = require('./Logic');

var Schema = mongoose.Schema;

var devSchema = new Schema ({
    gamerID: Schema.Types.ObjectId,
    name: String,
    date: { type: Date, default: Date.now() },
    picture: String,
    telephone: String,
    company: String,
    payPalAcc: String
});

var Developer = mongoose.model('Developer', devSchema);

/**
 * GET /developers/:id
 *
 * @description
 * Find developer by id
 *
 */

exports.getDev = function (gamerId, response) {
    Developer.findOne({gamerID: gamerId}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            response.json({"result": "SUCCESS", "dev": res});
        }
    });
};

/**
 * POST /developers
 *
 * @description
 * Create a new developer
 *
 */

exports.postDev = function (Dev, response) {
    Developer.create(Dev, function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            response.json({success: true});
        }
    });
};

/**
 * PUT /developers/:id
 *
 * @description
 * Update developers phone(?)
 *
 */
exports.updateDevTelephone = function (Dev, response) {
    Developer.findOne({gamerID: Dev.gamerID}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            res.telephone = Dev.telephone;
            res.save();
            response.json({success: true});
        }
    });
};

/**
 * PUT /developers/:id
 *
 * @description
 * Update developers paypal
 *
 */
exports.updateDevPayPalAcc = function (Dev, response) {
    Developer.findOne({gamerID: Dev.gamerID}).exec(function (err, res) {
        if (err) {
            response.send(500, {error: err});
        } else {
            res.payPalAcc = Dev.payPalAcc;
            res.save();
            response.json({success: true});
        }
    });
}
