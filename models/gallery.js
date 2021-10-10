const Joi = require('joi');
const mongoose = require('mongoose');
const galleryTypeSchema = require('./lookup');
const eventTypeSchema = require('./event');
const tagSchema = require('./lookup');
const galleryCategorySchema = require('./gallery_category');
const { boolean } = require('joi');
const gallerySchema = new mongoose.Schema({
  type: {
    // type: galleryTypeSchema,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lookup',
    required: true
  },
  fileurl: {
    type: String,
    required: true,
    unique: true
  },
  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  location:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lookup'
  },
  description: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: false
  },
  views: {
    type: Number,
    default: 0,
    required: false
  },
  istangible: {
    type: Boolean,
    required: true,
  },
  tags: {
    type: [String],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GalleryCategory'
  },
  capturedYear: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes:{
    type: Number,
    default:0,
    required:false
  },

});

gallerySchema.index({ '$**': 'text' })

const Gallery = mongoose.model('Gallery', gallerySchema);

function validateGallery(gallery) {
  const schema = Joi.object({
    type: Joi.string().required(),
    fileurl: Joi.string().required(),
    eventType: Joi.string().required(),
    description: Joi.string().required(),
    caption: Joi.string().required(),
    istangible: Joi.boolean().required(),
    tags: Joi.array().items(Joi.string()),
    category: Joi.string().required(),
    status: Joi.string().required(),
    capturedYear: Joi.string().required(),
    location:Joi.string().required()
  });
  const validation = schema.validate(gallery);
  return validation;
}

exports.Gallery = Gallery;
exports.validateGallery = validateGallery;