const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema({
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',  
    required: true
    },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalesAgent',  
    required: true
  },
  commentText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,  
  }
});

module.exports = mongoose.model('Comment', commentSchema);
