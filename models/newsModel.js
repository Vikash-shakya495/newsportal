const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  images: {
    type: [String],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Cars' ,'Politics', 'Health', 'Sports', 'Education', 'Business', 'Science', 'World', 'Entertainment', 'Ancient' , 'Technology', 'Other']
  },
  tags: {
    type: [String],
    default: []
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
  user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('News', newsSchema);
