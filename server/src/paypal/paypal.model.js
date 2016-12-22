var paypal = require('paypal-rest-sdk');
var shop = require('../shopHelper');
var gamer = require('../user/user.logic');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AV8CV49yFM01ha4e4N2hWpEQkSBLdTaGQgvCdJPJrF2LOD-pHV3r-H_U3Xmr-bpFXfNR9OaR9co2fXRR',
    'client_secret': 'EI58OXlnatIBdOhWAAx4DebjMxvIVZZ_FsrXkEE_oFeXg42zyo6aq8pSOirxW99AcbswXop4-Nhy4Pco'
});

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var paymentSchema = new Schema ({
    gamerID: Schema.Types.ObjectId,
    paymentID: String,
    payerID: String,
    approved: Boolean,
    total: Number, // profit for devs
    payee: String,
    currencyType: String,
    amount: Number,
    marketID: Schema.Types.ObjectId
});

module.exports = {

    getPayment: function (PaymentID, response) {
        paymentSchema.findOne({paymentID: PaymentID}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "payment": res});
            }
        });
    },

    getPayerPayments: function (PayerID, response) {
        paymentSchema.find({payerID: PayerID}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "payments": res});
            }
        });
    },

    getPayeePayments: function (Payee, response) {
        paymentSchema.find({payee: Payee}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "payments": res});
            }
        });
    },

    getApprovePayments: function (Approve, response) {
        paymentSchema.find({approve: Approve}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "payments": res});
            }
        });
    },

    createPayment: function (marketID, Offer, devPayPalAcc, price, total, gamerID, response) {
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/paypal/complete",
                "cancel_url": "http://localhost:3000"
            },
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": total
                },
                "item_list": {
                    "items": [{
                        "name": Offer.currencyType,
                        "sku": Offer.currencyType,
                        "price": price,
                        "currency": "USD",
                        "quantity": Offer.amount
                    }]
                },
                "payee":{"email": devPayPalAcc},
                "description": "Buying game currency"
            }]
        };
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                for (var index = 0; index < payment.links.length; index++) {
                    //Redirect user to this endpoint for redirect url
                    if (payment.links[index].rel === 'approval_url') {
                        console.log(payment.links[index].href);
                        response.redirect(payment.links[index].href);
                    }
                }
                console.log(payment);
                var myPayment = {};
                myPayment.gamerID = gamerID;
                myPayment.paymentID = payment.id;
                myPayment.approved = false;
                myPayment.total = total;
                myPayment.payee = devPayPalAcc;
                myPayment.currencyType = Offer.currencyType;
                myPayment.amount = Offer.amount;
                myPayment.marketID = marketID;
                myPayment.payerID = "None";
                postPayment(myPayment, response);
            }
        });
    },

    executePayment: function(PaymentID, PayerID, response) {
        paymentSchema.findOne({paymentID: PaymentID}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                console.log("Payment is received!");
                var execute_payment_json = {
                    "payer_id": PayerID,
                    "transactions": [{
                        "amount": {
                            "currency": "USD",
                            "total": res.total
                        },
                        "payee":{ "email": res.payee }
                    }]
                };

                paypal.payment.execute(PaymentID, execute_payment_json, function (error, payment) {
                    if (error) {
                        console.log(error.response);
                        throw error;
                    } else {
                        console.log("Get Payment Response");
                        res.approved = true;
                        res.payerID = PayerID;
                        res.save();
                        var Shop = {};
                        Shop.marketID = res.marketID;
                        Shop.history = {};
                        Shop.history.currencyType = res.currencyType;
                        Shop.history.amount = res.amount;
                        Shop.history.profit = res.total;
                        Shop.history.date = Date.now();
                        shop.updateShopHistoryByMarketID(Shop, response);
                        var Gamer = {};
                        Gamer.userID = res.gamerID;
                        Gamer.wallet = {};
                        Gamer.wallet.amount = res.amount;
                        Gamer.wallet.currencyType = res.currencyType;
                        Gamer.wallet.marketID = res.marketID;
                        gamer.UpdateWallet(Gamer, response);
                        // update user wallet
                        // update shop history
                        console.log(payment);
                        response.redirect('http://localhost:3000/');
                    }
                });
            }
        });
    }

};

function postPayment(Payment, response) {
    paymentSchema.create(Payment, function (err, res) {
        if(err){
            response.send(500, {error: err});
        } else {
            console.log("Payment is created!")
        }
    });
}
