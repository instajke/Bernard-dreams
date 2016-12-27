var request = require('supertestmarketbuy');
var should = require('should');
var mongoose = require('mongoose');

var app = require('../../server/app');

describe('CRUD on marketbuys ressources', function() {

  before(function(donePreparing) {
    // Clean DB
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }
    return donePreparing();
  });

  after(function(donePreparing) {
    // Clean DB
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }
    return donePreparing();
  });

  it('should POST a marketbuy ', function(done) {
    var postData = {
		    marketID: '1',
			marketType: 'eurogem',
			taxes: '3',
			currencyAnother: 'euro',
			currencyTypeBuy: 'gem',
			bestPrice: '10',
			curBuyings: '2', // if(curBuyings > newPrice) -> price changes in illusive markets
			newPrice: '8', // for illusive markets
			offers: [Price: '7', Amount: '100', offersInPrice: [amount: '90', gamerID:'2' ] }],
			graphicBuy: [ price:'10' , date: { type: Date, default: Date.now() }}]  // price changing in a market
    };

    request(app)
      .post('/api/marketbuys')
      .send(postData)
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.marketID.should.equal('1');
        res.body.marketType.should.equal('eurogem');
		res.body.taxes.should.equal('3');
		res.body.currencyAnother.should.equal('euro');
		res.body.currencyTypeBuy.should.equal('gem');
		res.body.bestPrice.should.equal('10');
		res.body.curBuyings.should.equal('2');
		res.body.newPrice.should.equal('8');
		res.body.offers.should.equal('[7, 100, [90, 2]]');
		res.body.graphicBuy.should.equal('[2, 21.11.2016]');
        done();
      });
  });

  it('should GET a list of marketbuys', function(done) {
    request(app)
      .get('/api/marketbuys')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        done();
      });
  });

  it('should GET a marketbuy', function(done) {
    request(app)
      .get('/api/marketbuys')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .get('/api/marketbuys/' + res.body[0]._marketid)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.marketID.should.equal('1');
			res.body.marketType.should.equal('eurogem');
			res.body.taxes.should.equal('3');
			res.body.currencyAnother.should.equal('euro');
			res.body.currencyTypeBuy.should.equal('gem');
			res.body.bestPrice.should.equal('10');
			res.body.curBuyings.should.equal('2');
			res.body.newPrice.should.equal('8');
			res.body.offers.should.equal('[7, 100, [90, 2]]');
			res.body.graphicBuy.should.equal('[2, 21.11.2016]');
            done();
          });
      });
  });

  it('should PUT a marketbuy', function(done) {
    var putData = {
		marketID: '1',
		taxes: '3'
    };
    request(app)
      .get('/api/marketbuys')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/marketbuys/' + res.body[0]._marketid)
          .send(putData)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.marketID.should.equal('1');
            res.body.taxes.should.equal('2');
            done();
          });
      });
  });
	it('should PUT a marketbuy', function(done) {
		var putData = {
			marketID: '1',
			marketType: 'eurogem'
		};
		request(app)
		  .get('/api/marketbuys')
		  .expect(500)
		  .end(function(err, res) {
			should.not.exist(err);
			res.body.should.be.instanceof(Array).and.have.lengthOf(1);
			request(app)
			  .put('/api/marketbuys/' + res.body[0]._marketid)
			  .send(putData)
			  .expect(500)
			  .end(function(err, res) {
				should.not.exist(err);
				res.body.marketID.should.equal('1');
				res.body.marketType.should.equal('dollargem');
				done();
			  });
		  });
	  });
	it('should GET a 404 error on unknow marketID', function(done) {
		request(app)
		  .get('/api/marketbuys/fakeid')
		  .expect(404, done());
  });
});
