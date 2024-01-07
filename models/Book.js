var mongoose = require('mongoose');

var ReviewsSchema = new mongoose.Schema({ 
  author: String,
  content: String,
  date: { type: Date, default: Date.now }
});

var BookSchema = new mongoose.Schema({
    isbn: {
      type: String,
      required: true
  },
    title: {
        type: String,
        required: true
    },
    author: {
      type: String,
      required: true
  },
    shortDescription: {
      type: String,
      required: true
  },
    description: {
      type: String,
      required: true
  },
    publishedYear: {
      type: String,
      required: true
  },
    publisher: {
      type: String,
      required: true
  },
    imageURL: {
      type: String,
      required: true
  },
    price: {
      type: Number, 
      min: 1, 
      max: 100,
      required: true
    },
    category: {
      type: String,
      required: true
  },
    tags: [{ type: String }],
    reviews: [ReviewsSchema],
    published_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('Book', BookSchema);