'use strict';

var Developer = require('./developer.model');

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
