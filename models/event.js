const Joi = require('joi');
const mongoose = require('mongoose');
const Gallery = require('./gallery');
const eventSchema = new mongoose.Schema({
 description: {
    type: String,
    required: true,
    unique: true
  },
  eventyear:{ 
    type : Date, 
    default: Date.now 
  }
});

eventSchema.pre('remove', async function (next) {
  try {
      await Gallery.Gallery.find({ 'eventType': this._id })
          .then((galleries) => {
              Promise.all(galleries.map(gal => gal.remove()))
                  .then(next());
          });
  } catch (error) {
      next(error);
  }
});

const Event = mongoose.model('Event', eventSchema);

function validateEvent(event) {
  const schema = Joi.object({
    description: Joi.string().min(5).required(),
    eventyear:Joi.date()
  });
  const validation = schema.validate(event);
  return validation;
}

exports.Event = Event; 
exports.validateEvent= validateEvent;