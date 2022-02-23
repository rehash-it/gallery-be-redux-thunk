const Joi = require("joi");
const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema({
  journeyName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  destinations: [
    {
      orderNo: Number,
      destinationName: String,
      picture: String,
      narration: String,
    },
  ],
});

const Journey = mongoose.model("Journey", journeySchema);

function validateJourney(journey) {
  const schema = Joi.object({
    journeyName: Joi.string.required(),
    description: Joi.string.required(),
    destinations: Joi.array.items(Joi.object()),
  });

  const validation = schema.validate(journey);
  return validation;
}

exports.Journey = Journey;
exports.validateJourney = validateJourney;
