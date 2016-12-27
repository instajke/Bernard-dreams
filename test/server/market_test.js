var request = require('marketsupertest');
var should = require('should');
var mongoose = require('mongoose');

var app = require('../../server/app');

describe('CRUD on markets ressources', function() {

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

  it('should POST a market', function(done) {
    var postData = {
		devID: 1,
		marketType: 'EUROGold',
		name: 'EGold',
		description: 'euro exchange gold',
		showOffers: 'true',
		tax: '3', // percents
		newPrice: '50', // amount of buying that might change price in illusive markets
		currencyType1: 'gold', // gold
		currencyType2: 'gem'
    };

    request(app)
      .post('/api/markets')
      .send(postData)
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.devID.should.equal('1');
        res.body.marketType.should.equal('EUROGold');
		res.body.name.should.equal('EGold');
		res.body.description.should.equal('euro exchange gold');
		res.body.showOffers.should.equal('true');
		res.body.tax.should.equal('3');
		res.body.newPrice.should.equal('50');
		res.body.currencyType1.should.equal('gold');
		res.body.currencyType2.should.equal('gem');
        done();
      });
  });

  it('should GET a list of markets', function(done) {
    request(app)
      .get('/api/markets')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        done();
      });
  });

  it('should GET a market', function(done) {
    request(app)
      .get('/api/markets')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .get('/api/markets/' + res.body[0]._id)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.devID.should.equal('1');
			res.body.marketType.should.equal('EUROGold');
			res.body.name.should.equal('EGold');
			res.body.description.should.equal('euro exchange gold');
			res.body.showOffers.should.equal('true');
			res.body.tax.should.equal('3');
			res.body.newPrice.should.equal('50');
			res.body.currencyType1.should.equal('gold');
			res.body.currencyType2.should.equal('gem');
            done();
          });
      });
  });

  it('should update a market', function(done) {
    var putData = {
      marketType: 'EUROGold',
      showOffers: 'true'
    };
    request(app)
      .get('/api/markets/')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/markets/' + res.body[0]._id)
          .send(putData)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.marketType.should.equal('EUROGold');
            res.body.showOffers.should.equal('false');
            done();
          });
      });
  });
  it('should update a market', function(done) {
    var putData = {
      marketType: 'EUROGold',
    };
    request(app)
      .get('/api/markets/')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/markets/' + res.body[0]._id)
          .send(putData)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.marketType.should.equal('EUROGem');
            done();
          });
      });
  });
  it('should update a market', function(done) {
    var putData = {
      marketType: 'EUROGem',
      tax: '3'
    };
    request(app)
      .get('/api/markets/')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/markets/' + res.body[0]._id)
          .send(putData)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.marketType.should.equal('EUROGem');
            res.body.tax.should.equal('5');
            done();
          });
      });
  });
  it('should update a market', function(done) {
    var putData = {
      marketType: 'EUROGem',
      description: 'euro exchange gold'
    };
    request(app)
      .get('/api/markets/')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/markets/' + res.body[0]._id)
          .send(putData)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.marketType.should.equal('EUROGem');
            res.body.description.should.equal('euro exchange gem');
            done();
          });
      });
  });

});
