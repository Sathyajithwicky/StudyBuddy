const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
      
        if (this.status === 'approved' && !v) {
          return false;
        }
        return true;
      },
      message: 'Answer is required when the FAQ is approved.',
    },
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


FAQSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


FAQSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('FAQ', FAQSchema);
