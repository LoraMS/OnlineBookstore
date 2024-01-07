const mongoose = require('mongoose');
const passport = require('passport');
let settings = require('../config/settings');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const router = express.Router();
const User = require("../models/user");
const Event = require("./../models/Event.js");

function validateRegisterForm (payload) {
  let message = '';
  let success = true;

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    success = false;
    message = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 4) {
    success = false;
    message = 'Password must have at least 4 characters.';
  }

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    success = false;
    message = 'Please provide your name.';
  }

  return {
    message, success
  }
}

function validateLoginForm (payload) {
  let message = '';
  let success = true;

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    success = false;
    message = 'Please provide your name.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    success = false;
    message = 'Please provide your password.';
  }

  return {
    message, success
  }
}

router.post('/register', function(req, res) {
  const validationResult = validateRegisterForm(req.body);
  if (!validationResult.success) {
    res.status(401).send({success: false,  message: validationResult.message});
  } else {
    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        res.status(401).send({success: false, message: 'Username already exists.'});
      }
      res.json({success: true, message: 'You have successfully signed up!'});
    });
  }
});

router.post('/login', function(req, res) {
  
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

  //   const validationResult = validateLoginForm(req.body);
  // if (!validationResult.success) {
  //   res.status(401).send({
  //     success: false,
  //     message: validationResult.message
  //   })
  // } 

    if (!user) {
      res.status(401).send({success: false, message: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.toJSON(), settings.secret);
              
          const name = user.username;
          const email = user.email;
          const role = user.role;
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token, name: name, email: email, role: role, message: 'Successful logged!' });
          } else {
            res.status(401).send({success: false, message: 'Authentication failed. Wrong name or password.'});
          }
        });
      }
    });
});

router.get('/all', passport.authenticate('jwt', { session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    User.find(function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized. Please Login.'});
  }
});

router.get('/all/:name', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    User.findOne({username: req.params.name}, function (err, user) {
      if (err) return next(err);
      res.json(user);
    });
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized. Please Login'});
  }
});

router.delete('/all/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized. Please Login'});
  }
});

router.put('/participate', passport.authenticate('jwt', { session: false}), function(req, res) {
  let token = getToken(req.headers);
  if (token) {
    Promise.all([
      User.findOne({username: req.body.name}).exec(),
      Event.findById(req.body.eventId).exec()
    ])
    .then(function(results) {
      let user = results[0];
      let event = results[1];
      let eventId = req.body.eventId;
      let title = req.body.title;
      user.eventList.push({eventId, title});

      let uName = req.body.name;
      event.users.push(uName);

      return Promise.all([user, event])
        .then(function(results){
          results.map(item => item.save())
          res.send(results);
        });
    }).catch(function(err) {
      res.send(err);
  });
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized. Please Login'});
  }
});

router.put('/leave', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    Promise.all([
      User.findOne({username: req.body.name}).exec(),
      Event.findById(req.body.eventId).exec()
    ])
    .then(function(results) {
      let user = results[0];
      let event = results[1];
      let eventId = req.body.eventId;
      let eIndex = user.eventList.findIndex(e => e.eventId == eventId);
      if(eIndex !== -1){
        user.eventList.splice(eIndex, 1);
      }

      let uName = req.body.name;
      let uIndex = event.users.findIndex(u => u === uName);
      if(uIndex !== -1){
        event.users.splice(uIndex, 1);
      }

      return Promise.all([user, event])
        .then(function(results){
          results.map(item => item.save())
          res.send(results);
        });
    }).catch(function(err) {
      res.send(err);
  });    
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized. Please Login'});
  }
});

router.put('/add', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    User.findOne({username: req.body.name}, function (err, user) {
      if (err) { return next(err); }
      let bookId = req.body.bookId;
      let title = req.body.title;
      user.bookList.push({bookId, title});
      user.save(function (err, updated) {
        if (err) { return next(err); }
        res.send(updated);
      });
    });
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized. Please Login'});
  }
});

router.put('/remove', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  let token = getToken(req.headers);
  if (token) {
    User.findOne({username: req.body.name}, function (err, user) {
      if (err) { return next(err); }
      let bookId = req.body.bookId;
      let bIndex = user.bookList.findIndex(b => b.bookId == bookId);
      if(bIndex !== -1){
        user.bookList.splice(bIndex, 1);
      }
      user.save(function (err, updated) {
        if (err) { return next(err); }
        res.send(updated);
      });
    });
  } else {
    return res.status(403).send({success: false, message: 'Unauthorized. Please Login'});
  }
});

module.exports = router;



/*
router.put('/participate', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    User.findOne({username: req.body.name}, function (err, user) {
      var eventId = req.body.eventId;
      var title = req.body.title;
      user.eventList.push({eventId, title});
      user.save(function (err, updated) {
        // if (err) { return next(err); }
        res.send(updated);
      });
    });
    
    Event.findById(req.body.eventId, function (err, event) {
      var user = req.body.name;
      event.users.push(user);
      event.save(function (err, updated) {
        // if (err) { return next(err); }
        res.send(updated);
      });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.put('/leave', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    User.findOne({username: req.body.name}, function (err, user) {
      var eventId = req.body.eventId;
      var eIndex = user.eventList.findIndex(e => e.eventId == eventId);
      if(eIndex !== -1){
        user.eventList.splice(eIndex, 1);
      }
      user.save(function (err, updated) {
        // if (err) { return next(err); }
        res.send(updated);
      });
    });

    Event.findById(req.body.eventId, function (err, event) {
      var user = req.body.name;
      var uIndex = event.users.findIndex(u => u === user);
      if(uIndex !== -1){
        event.users.splice(uIndex, 1);
      }
      event.save(function (err, updated) {
        // if (err) { return next(err); }
        res.send(updated);
      });
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});
*/