var request = require('ghsupertest');
var should = require('should');
var mongoose = require('mongoose');

var app = require('../../server/app');

describe('CRUD on gamhistressources', function() {

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

  it('should POST a gamer history', function(done) {
    var postData = {
		gamerID: '1',
		history: '[currencyType1: gold, amount1: 5, currencyType2: gem, amount2: 1, date: { type: Date, default: Date.now()}]'
    };

    request(app)
      .post('/api/gamhist')
      .send(postData)
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.gamerID.should.equal('1');
        res.body.history.should.equal('[gold, 5, gem, 1]');
        done();
      });
  });

  it('should GET a list of gamers history', function(done) {
    request(app)
      .get('/api/gamhist')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        done();
      });
  });

  it('should GET a gamer history', function(done) {
    request(app)
      .get('/api/gamhist')
      .expect(500)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .get('/api/gamhist/' + res.body[0]._id)
          .expect(500)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.gamerID.should.equal('1');
			res.body.history.should.equal('[gold, 5, gem, 1]');
            done();
          });
      });
  });

  it('should update a gamer history', function(done) {
    var putData = {
      gamerID '1',
      history: '[euro, 5, gold, 1]'};
    request(app)
      .get('/api/things')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/things/' + res.body[0]._id)
          .send(putData)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.gamerID.should.equal('1');
            res.body.history.should.equal('[gold, 8, gem, 2]');
            done();
          });
      });
  });
  
  it('should update a gamer history', function(done) {
    var putData = {
      gamerID '1',
      history: '[euro, 5, gold, 1]';
    request(app)
      .get('/api/things')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/things/' + res.body[0]._id)
          .send(putData)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.gamerID.should.equal('1');
            res.body.history.should.equal('[, , , ]');
            done();
          });
      });
  });

});
