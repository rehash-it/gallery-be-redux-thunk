const Joi = require('joi');
const mongoose = require('mongoose');
const contactInfoSchema = new mongoose.Schema({
 name: {
    type: String,
  },
  email:{
    type: String,
    required: true,
  },
  content:{
    type: String,
    required: true,
  }
});

const ContactInfo = mongoose.model('ContactInfo', contactInfoSchema);

function validateContactInfo(contactInfo) {
  const schema = Joi.object({
    name: Joi.string().min(2),
    email: Joi.string().email().required(),
    content: Joi.string().min(5).required(),
  });
  const validation = schema.validate(contactInfo);
  return validation;
}

exports.ContactInfo = ContactInfo; 
exports.validateContactInfo= validateContactInfo;