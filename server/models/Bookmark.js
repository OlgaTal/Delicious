/* eslint-disable func-names */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookmarkSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
  isProtected: { type: Boolean, default: true },
  datePublished: { type: Date, default: Date.now },
  dateCreated: { type: Date, default: Date.now },
  stars: { type: Number, default: 0 },
  tags: { type: [String], default: [] },

});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
