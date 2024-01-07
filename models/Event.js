var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
  },
    description: {
      type: String,
      required: true
  },
    eventDate: {
      type: Date,
      required: true
  },
    hours: {
      type: String,
      required: true
  },
    imageURL: {
      type: String,
      required: true
  },
    category: {
      type: String,
      required: true
  },
    users: [{ type: String }],
    published_date: { 
      type: Date, 
      default: Date.now 
    },
  });

  module.exports = mongoose.model('Event', EventSchema);