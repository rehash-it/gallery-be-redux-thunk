const Joi = require("joi");
const mongoose = require("mongoose");
const galleryTypeSchema = require("./lookup");
const eventTypeSchema = require("./event");
const tagSchema = require("./lookup");
const galleryCategorySchema = require("./gallery_category");
const { boolean } = require("joi");
const gallerySchema = new mongoose.Schema({
  type: {
    // type: galleryTypeSchema,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lookup",
    required: true,
  },
  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lookup",
  },
  description: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: false,
  },
  views: {
    type: Number,
    default: 0,
    required: false,
  },
  istangible: {
    type: Boolean,
    required: true,
  },
  isDownloadable: {
    type: Boolean,
    required: true,
  },
  tags: {
    type: [String],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GalleryCategory",
  },
  status: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imagesValues: [
    {
      url: { type: String, required: true },
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
      capturedYear: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

gallerySchema.index({ "$**": "text" });

const Gallery = mongoose.model("Gallery", gallerySchema);

function validateGallery(gallery) {
  const schema = Joi.object({
    type: Joi.string().required(),
    imagesValues: Joi.array().required(),
    eventType: Joi.string().required(),
    description: Joi.string().required(),
    caption: Joi.string().required(),
    istangible: Joi.boolean().required(),
    isDownloadable: Joi.boolean().required(),
    tags: Joi.array().items(Joi.string()),
    category: Joi.string().required(),
    status: Joi.string().required(),
    location: Joi.string().required(),
    createdBy: Joi.string(),
  });
  const validation = schema.validate(gallery);
  return validation;
}

exports.Gallery = Gallery;
exports.validateGallery = validateGallery;
