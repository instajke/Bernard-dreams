'use strict';

var user = require('./user.model.js');

/**
 * GET /users
 *
 * @description
 * list of users
 *
 */
exports.find = function(req, res, next) {
  user.find(function(err, users) {
    if (err) {
      return next(err);
    }
    return res.status(200).json(users);
  });
};

/**
 * GET /users/:id
 *
 * @description
 * Find user by id
 *
 */
exports.get = function(req, res, next) {
  user.find({ email : req.params.email, password : req.params.password}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).send('Not Found');
    }
    return res.status(200).json(user);
  });
};

exports.findByEmail = function(req, res, next) {
  var accountProjection = {
    __v : false,
    _id : false
  };

  user.find({email : req.params.email, password : req.params.password}, accountProjection, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).send('Not Found');
    }
    return res.status(200).json(user);
  });
};


/**
 * POST /users
 *
 * @description
 * Create a new user
 *
 */
exports.post = function(req, res, next) {
  user.create(req.body, function(err, user) {
    if (err) {
      return next(err);
    }
    return res.status(201).json(user);
  });
};

/**
 * PUT /users/:id
 *
 * @description
 * Update a user
 *
 */
exports.put = function(req, res, next) {
  user.findById(req.params.id, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).send('Not Found');
    }

    user.email = req.body.email;
    user.password = req.body.password;
    user.name = req.body.name;
    user.surname = req.body.surname;
    user.bio = req.body.bio;


    user.save(function(err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json(user);
    });
  });
};

exports.updateUser = function(User, response) {
  console.log("UPDATE USER");
  console.log(User);
  user.findById(User._id, function(err, user) {
    if (err) {
      response.send(500, {error: err});
    } else {
      user.email = User.email;
      user.name = User.name;
      user.surname = User.surname;
      user.description = User.description;
      user.save();
      response.json({success: true});
    }
  })
};
