const Joi = require('joi');
const mongoose = require('mongoose');
const Gallery = require('./gallery');
const galleryCategorySchema = new mongoose.Schema({
 description: {
    type: String,    
    required: true,
  },
 fileurl:{
    type: String,
    unique: true,
    required: true,
  }
});

galleryCategorySchema.pre('remove', async function (next) {
  try {
      await Gallery.Gallery.find({ 'category': this._id })
          .then((galleries) => {
              Promise.all(galleries.map(gal => gal.remove()))
                  .then(next());
          });
  } catch (error) {
      next(error);
  }
});

const GalleryCategory = mongoose.model('GalleryCategory', galleryCategorySchema);

function validateGalleryCategory(galleryCategory) {
  const schema = Joi.object({
    description: Joi.string().required(),
    fileurl: Joi.string().required()
  });
  const validation = schema.validate(galleryCategory);
  return validation;
}

exports.GalleryCategory = GalleryCategory; 
exports.validateGalleryCategory= validateGalleryCategory;