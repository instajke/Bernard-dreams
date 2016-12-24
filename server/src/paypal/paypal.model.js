var paypal = require('paypal-rest-sdk');
var shop = require('../shopHelper');
var user = require('../user/user.controller');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Acmv3k9LnYgKLuOO0qaAQ5B-PTQ-PrpvY4uSWPZH_zRvTn13RzCwoReQUZjPriZix-s3XX16XdciMjet',
    'client_secret': 'EOG5xdmFc69_I2Lpk8EMbBWlMfi8mwHioB7RvK1uYvT4DbPY1RyugCLmUPBV_w81HnMjJP434XHoS6-V'
});

var mongoose = require('mongoose').set('debug', true);

var Schema = mongoose.Schema;

var paymentSchema = new Schema ({
    userID: Schema.Types.ObjectId,
    paymentID: String,
    payerID: String,
    approved: Boolean,
    total: Number, // profit for devs
    payee: String,
    currencyType: String,
    amount: Number,
    marketID: Schema.Types.ObjectId
});

var Payment = mongoose.model('Payment', paymentSchema);

function postPayment(payment, response) {
    Payment.create(payment, function (err, res) {
        if(err){
            response.send(500, {error: err});
        } else {
            console.log(payment.userID);
            console.log("Payment is created!")
        }
    });
};

module.exports = {

    getPayment: function (PaymentID, response) {
        Payment.findOne({paymentID: PaymentID}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "payment": res});
            }
        });
    },

    getPayerPayments: function (PayerID, response) {
        Payment.find({payerID: PayerID}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "payments": res});
            }
        });
    },

    getPayeePayments: function (Payee, response) {
        Payment.find({payee: Payee}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "payments": res});
            }
        });
    },

    getApprovePayments: function (Approve, response) {
        Payment.find({approve: Approve}).exec(function (err,res) {
            if(err){
                response.send(500, {error: err});
            } else {
                response.json({"result": "SUCCESS", "payments": res});
            }
        });
    },

    createPayment: function (marketID, Offer, devPayPalAcc, price, total, userID, response) {
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://kmpm.eu-gb.mybluemix.net/api/paypal/complete",
                "cancel_url": "http://kmpm.eu-gb.mybluemix.net/"
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
                myPayment.userID = mongoose.Types.ObjectId(userID);
                myPayment.paymentID = payment.id;
                myPayment.approved = false;
                myPayment.total = total;
                myPayment.payee = devPayPalAcc;
                myPayment.currencyType = Offer.currencyType;
                myPayment.amount = Offer.amount;
                myPayment.marketID = mongoose.Types.ObjectId(marketID);
                myPayment.payerID = "None";
                console.log(myPayment);
                postPayment(myPayment, response);
            }
        });
    },

    executePayment: function(PaymentID, PayerID, response) {
        Payment.findOne({paymentID: PaymentID}).exec(function (err,res) {
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
                        Gamer._id = res.userID;
                        Gamer.wallet = {};
                        Gamer.wallet.amount = res.amount;
                        Gamer.wallet.currencyType = res.currencyType;
                        Gamer.wallet.marketID = res.marketID;
                        user.updateWallet(Gamer, response);
                       
                        // update user wallet
                        // update shop history
                        console.log(payment);
                        response.redirect('http://kmpm.eu-gb.mybluemix.net/');
                    }
                });
            }
        });
    }

};
