const express = require('express');
const router = express.Router();
const validator = require('validator');
const mongoose = require('mongoose');
const Event = require('../models/Event.js');

const passport = require('passport');
require('../config/passport')(passport);

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

function validateForm (payload) {
  let success = true;
  let message = '';

  if (!payload || typeof payload.title !== 'string' || payload.title.trim().length < 5) {
    success = false
    message = 'Title must be more than 5 symbols.'
  }

  if (!payload || typeof payload.description !== 'string' || payload.description.trim().length < 100) {
    success = false
    message = 'Description must be more than 100 symbols.'
  }

  if (!payload || typeof payload.eventDate !== 'string' || validator.isBefore(payload.eventDate)) { 
    success = false
    message = 'Date is not correct.'
  }

  if (!payload || typeof payload.hours !== 'string' || payload.hours.match(/^[1-8]+$/) === null) {
    success = false
    message = 'Hour must be number between 1 and 8.'
  }

  if (!payload || typeof payload.category !== 'string' || payload.category.trim().length < 5) {
    success = false
    message = 'Category is required and must be more then 5 symbols.'
  }

  if (!payload || typeof payload.imageURL !== 'string' || !validator.isURL(payload.imageURL)) {
    success = false
    message = 'Image URL is not correct.'
  }

  return {
    success,
    message,
  }
}
 /* Get Events */
router.get('/', function(req, res, next) {
    Event.find(function (err, products) {
      if (err) return next(err);
      res.json(products);
    }).sort({eventDate: -1});
  });

   /* Get Events By Category */
 router.get('/evcategory/:name', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
  Event.find({category:req.params.name} , req.body, function(err, ev) {
    if (err)return next(err);
    res.json(ev);
  }).sort({eventDate: -1});
} else {
      return res.status(403).send({success: false, msg: 'Unauthorized. Please Login.'});
    }
});

 /* Get Event By Id */
router.get('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Event.findById(req.params.id, function (err, events) {
      if (err) return next(err);
      res.json(events);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized. Please Login.'});
  }
});

 /* Save Event */
router.post('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    const validationResult = validateForm(req.body);
    if (!validationResult.success) {
        res.status(401).send({success: false,  message: validationResult.message});
    }  else {
      Event.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
      });
    }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized. Please Login.'});
  }
});

 /* Edit Event */
router.put('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    const validationResult = validateForm(req.body);
    if (!validationResult.success) {
        res.status(401).send({success: false,  message: validationResult.message});
    }  else {
      Event.findByIdAndUpdate(req.params.id,req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
      });
    }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized. Please Login.'});
  }
});

 /* Delete Event */
router.delete('/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Event.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized. Please Login.'});
  }
});


module.exports = router;