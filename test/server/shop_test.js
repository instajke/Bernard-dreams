var request = require('shopsupertest');
var should = require('should');
var mongoose = require('mongoose');

var app = require('../../server/app');

describe('CRUD on shops ressources', function() {

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

  it('should POST a shop', function(done) {
    var postData = {
     name: 'shop1',
    devID: '1',
    offers: [ID: '1', currencyType: 'gold', amount: '5', price: '22', discount: '3'],
    payPalAcc: '111111111',
    publicHistory: 'true',
    history: [ currencyType: 'gold', amount: '4', profit: '2']
	};

    request(app)
      .post('/api/shops')
      .send(postData)
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.name.should.equal('shop1');
		res.body.devID.should.equal('1');
		res.body.offers.should.equal('[1, euro, 5, 22, 3]');
		res.body.payPalAcc.should.equal('111111111');
		res.body.publicHistory.should.equal('true');
		res.body.history.should.equal('[gold, 4, 2]');
        done();
      });
  });

  it('should GET a list of shops', function(done) {
    request(app)
      .get('/api/gamers')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        done();
      });
  });

  it('should GET a shop', function(done) {
    request(app)
      .get('/api/shops')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .get('/api/shops/' + res.body[0]._id)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.name.should.equal('shop1');
			res.body.devID.should.equal('1');
			res.body.offers.should.equal('[1, euro, 5, 22, 3]');
			res.body.payPalAcc.should.equal('111111111');
			res.body.publicHistory.should.equal('true');
			res.body.history.should.equal('[gold, 4, 2]');
            done();
          });
      });
  });

  it('should update a shop', function(done) {
    var putData = {
      name: 'shop1',
      history: '[gold, 4, 2]'
    };
    request(app)
      .get('/api/shops')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/shops/' + res.body[0]._id)
          .send(putData)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.name.should.equal('shop1-update');
            res.body.history.should.equal('[gold, 5, 3]');
            done();
          });
      });
  });
  it('should update a shop', function(done) {
    var putData = {
      name: 'shop1',
      history: '[gold, 4, 2]'
    };
    request(app)
      .get('/api/shops')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/shops/' + res.body[0]._id)
          .send(putData)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.name.should.equal('shop1-update');
            res.body.history.should.equal('');
            done();
          });
      });
  });
it('should update a shop', function(done) {
    var putData = {
      name: 'shop2',
      payPalAcc: '111111111'
    };
    request(app)
      .get('/api/shops')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/shops/' + res.body[0]._id)
          .send(putData)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.name.should.equal('shop2-update');
            res.body.payPalAcc.should.equal('222222222');
            done();
          });
      });
  });
  
 it('should update a shop', function(done) {
    var putData = {
      name: 'shop3',
      offers: '[1, gold, 5, 22, 3]'
    };
    request(app)
      .get('/api/shops')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/shops/' + res.body[0]._id)
          .send(putData)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.name.should.equal('shop3-update');
            res.body.payPalAcc.should.equal('[1, gem, 6, 20, 5]');
            done();
          });
      });
  });
   it('should update a shop', function(done) {
    var putData = {
      name: 'shop3',
      offers: '[1, gold, 5, 22, 3]'
    };
    request(app)
      .get('/api/shops')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/shops/' + res.body[0]._id)
          .send(putData)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.name.should.equal('shop3-update');
            res.body.payPalAcc.should.equal('[]');
            done();
          });
      });
  });
});
