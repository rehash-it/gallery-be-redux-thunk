const {Lookup, validateLookup} = require('../models/lookup');
const APIFeatures = require('./../utils/APIFeatures');

exports.getLookup =async (req, res) => {
      const apiFeatures = new APIFeatures(Lookup.find().sort('description'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const lookup= await apiFeatures.query;
  if (!lookup) return sendError("No report founds yet", res, 404)
  res.send(lookup);
};

exports.createLookup =async (req, res) => {
    const { error } = validateLookup(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let lookup = new Lookup({ description: req.body.description,type:req.body.type });
    lookup = await lookup.save();
    
    res.send(lookup);
};
exports.updateLookup = async (req, res) => {
    const { error } = validateLookup(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const lookup = await Lookup.findByIdAndUpdate(req.params.id, { description: req.body.description,type:req.body.type }, {
      new: true
    });
  
    if (!lookup) return res.status(404).send('The Lookup with the given ID was not found.');
    
    res.send(lookup);
};


exports.deleteLookup =async (req, res) => {
    const lookup = await Lookup.findByIdAndRemove(req.params.id);
  
    if (!lookup) return res.status(404).send('The Lookup with the given ID was not found.');
  
    res.send(lookup);
};

exports.getLookupByType = async (req, res) => {
    const lookup= await Lookup.find({"type": req.params.type});
  
    if (!lookup) return res.status(404).send('The Lookup with the given ID was not found.');
  
    res.status(200).send(lookup);

};
exports.getLookupById = async (req, res) => {
    const lookup = await Lookup.findById(req.params.id);

    if (!lookup) return res.status(404).send('The Lookup with the given ID was not found.');

    res.send(lookup);
};