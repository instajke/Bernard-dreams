var request = require('supertestuser');
var should = require('should');
var mongoose = require('mongoose');

var app = require('../../server/app');

describe('CRUD on users ressources', function() {

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

  it('should POST a user', function(done) {
    var postData = {
	  username: 'UserTest',
	  email: 'test@test.by',
	  name: 'TEST',
	  surname: 'TEST test',
      description: 'Test user',
	  password: 'test user test'
    };

    request(app)
      .post('/api/users')
      .send(postData)
      .expect(201)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.username.should.equal('UserTest');
		res.body.email.should.equal('test@test.by');
		res.body.name.should.equal('TEST');
		res.body.surname.should.equal('TEST test');
        res.body.description.should.equal('Test user');
		res.body.password.should.equal('test user test');
        done();
      });
  });

  it('should GET a list of users', function(done) {
    request(app)
      .get('/api/users')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        done();
      });
  });

  it('should GET a user', function(done) {
    request(app)
      .get('/api/users')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .get('/api/users/' + res.body[0]._id)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.email.should.equal('test@test.by');
            res.body.password.should.equal('test user test');
            done();
          });
      });
  });

  it('should PUT a user', function(done) {
    var putData = {
      name: 'UserTEST-UPDATE',
      description: 'Test updated user'
    };
    request(app)
      .get('/api/users')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        request(app)
          .put('/api/users/' + res.body[0]._id)
          .send(putData)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.email.should.equal('uptest@test.by');
			res.body.password.should.equal('uptest user test');
			res.body.name.should.equal('upTEST');
			res.body.surname.should.equal('upTEST test');
			res.body.bio.should.equal('Test user update');
			
            done();
          });
      });
  });

  it('should GET a 404 error on unknow id', function(done) {
    request(app)
      .get('/api/users/fakeid')
      .expect(404, done());
  });
});
