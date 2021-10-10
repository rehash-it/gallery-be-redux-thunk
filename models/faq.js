const Joi = require('joi');
const mongoose = require('mongoose');
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer:{
    type: String,
    required: true
  },
  relevant:{
      type: Boolean,
      required: true
  },
  dateadded:{
      type: Date,
      required: true
  }
});

const Faq = mongoose.model('Faq', faqSchema);

function validateFaq(faq) {
  const schema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    relevant: Joi.boolean().required(),
    dateadded: Joi.string().required(),
  });
  const validation = schema.validate(faq);
  return validation;
}

exports.Faq = Faq; 
exports.validateFaq= validateFaq;