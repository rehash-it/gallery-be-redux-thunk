const { Journey, validateJourney } = require("../models/journey");
const APIFeatures = require("../utils/APIFeatures");

exports.getJourney = async (req, res) => {
  const apiFeatures = new APIFeatures(Journey.find().sort("journeyName"), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const journey = await apiFeatures.query;
  if (!journey) return sendError("No Journey data found", res, 404);
  res.send(journey);
};

exports.createJourney = async (req, res) => {
  const { error } = validateJourney(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let journey = new Journey({
    journeyName: req.body.journeyName,
    description: req.body.description,
    destinations: req.body.destinations,
  });

  journey = await journey.save();

  res.send(journey);
};

exports.updateJourney = async (req, res) => {
  const { error } = validateJourney(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const journey = await Journey.findByIdAndUpdate(
    req.params_id,
    {
      journeyName: req.body.journeyName,
      description: req.body.description,
      destinations: req.body.destinations,
    },
    {
      new: true,
    }
  );
  if (!journey)
    return res.status(404).send("The Journey with the given ID was not found.");
    res.send(journey);
};

exports.deleteJourney = async function (req, res, next){
    Journey.findById(req.params.id, function (err, journey){
        if (err) return next(err);
        journey.remove();
        res.status(200).send(journey)
    })
};

exports.getJourneyById = async (req, res) => {
    const journey = await Journey.findById(req.params.id);
    if(!journey) return res.status(404).send('THe Journey data with the given ID was not found')
    res.send(journey);
};