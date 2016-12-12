'use strict';

var user = require('./user.model');

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
  user.findById(req.params.id, function(err, user) {
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

    user.name = req.body.name;
    user.description = req.body.description;

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      return res.status(200).json(user);
    });
  });
};
