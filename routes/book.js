const express = require('express');
const router = express.Router();
const validator = require('validator');
const mongoose = require('mongoose');
const Book = require('../models/Book.js');

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

  if (!payload || typeof payload.isbn !== 'string' || payload.isbn.trim().length < 2) {
    success = false
    message = 'ISBN must be more than 2 symbols.'
  }

  if (!payload || typeof payload.title !== 'string' || payload.title.trim().length < 5) {
    success = false
    message = 'Title must be more than 5 symbols.'
  }

  if (!payload || typeof payload.author !== 'string' || payload.author.trim().length < 2) {
    success = false
    message = 'Author must be more than 2 symbols.'
  }

  if (!payload || typeof payload.shortDescription !== 'string' || payload.shortDescription.trim().length < 10) {
    success = false
    message = 'Description must be more than 10 symbols.'
  }

  if (!payload || typeof payload.description !== 'string' || payload.description.trim().length < 100) {
    success = false
    message = 'Description must be more than 100 symbols.'
  }

  if (!payload || typeof payload.publisher !== 'string' || payload.publisher.trim().length < 2) {
    success = false
    message = 'Publisher must be more than 2 symbols.'
  }

  if (!payload || typeof payload.category !== 'string' || payload.category.trim().length < 5) {
    success = false
    message = 'Category is required.'
  }

  if (!payload || typeof payload.imageURL !== 'string' || !validator.isURL(payload.imageURL)) {
    success = false
    message = 'Image URL is no correct.'
  }

  if (!payload || payload.price < 0) {
    success = false
    message = 'Price must be a positive number between 1 and 100.'
  }

  return {
    success,
    message,
  }
}

function validateCommentForm (payload) {
  let success = true;
  let message = '';

  if (!payload || typeof payload.content !== 'string' || payload.content.length < 2) {
    success = false
    message = 'Comment must be more than 2 symbols.'
  }
  return {
    success,
    message,
  }
}

/* Get All Books */
router.get('/', function(req, res, next) {
    Book.find(function (err, products) {
      if (err) return next(err);
      res.json(products);
    }).sort({isbn: 1});
  });


  /* Get Books By Category */
router.get('/category/:name', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
  Book.find({category:req.params.name} , req.body, function(err, products) {
    if (err)return next(err);
    res.json(products);
  });
} else {
      return res.status(403).send({success: false, msg: 'Unauthorized. Please Login.'});
    }
});

/* Get Single Book by Id */
router.get('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    Book.findById(req.params.id, function (err, books) {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.  Please Login.'});
  }
});

/* Save Book */
router.post('/', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    const validationResult = validateForm(req.body);
    if (!validationResult.success) {
        res.status(401).send({success: false,  message: validationResult.message});
    }  else {
      Book.create(req.body, function (err, post) {
      if (err) return next(err);  
      res.json(post);
    });
  }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized. Please Login.'});
  }
});

/* Update Book */
router.put('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    const validationResult = validateForm(req.body);
    if (!validationResult.success) {
        res.status(401).send({success: false,  message: validationResult.message});
    }  else {
    Book.findByIdAndUpdate(req.params.id,req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.  Please Login.'});
  }
});

/* Delete Book */
router.delete('/:id', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    Book.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.  Please Login.'});
  }
});

/* Add comment */
router.put('/:id/comments', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    const validationResult = validateCommentForm(req.body);
    if(!validationResult.success){
      res.status(401).send({success: false,  message: validationResult.message});
    } else {
    Book.findById(req.params.id, function (err, book) {
      if (err) { return next(err); }
      if (!book) { return res.send(404); }
      var author = req.body.author;
      var content = req.body.content;
      book.reviews.push({author, content});
      book.save(function (err, updated) {
        if (err) { return next(err); }
        res.send(updated);
      });
    });
  }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.  Please Login.'});
  }
});

module.exports = router;