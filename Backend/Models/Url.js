const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    visits: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        browser: {
          type: String,
          default: 'Unknown',
        },
        device: {
          type: String,
          default: 'Desktop',
        },
        country: {
          type: String,
          default: 'United States',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
