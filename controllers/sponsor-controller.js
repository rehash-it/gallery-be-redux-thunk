const { Sponsor, validateSponsor } = require('../models/sponsor');
const APIFeatures = require('./../utils/APIFeatures');

exports.getSponsor = async (req, res) => {

    const apiFeatures = new APIFeatures(Sponsor.find().populate('spClass'), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const sponsor = await apiFeatures.query;
    if (!sponsor) return res.status(404).send('No sponsor(s) found with the provided data.');

    res.status(200).send(sponsor);
};

exports.createSponsor = async (req, res) => {
    const { error } = validateSponsor(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let sponsor = new Sponsor({
        name: req.body.name,
        spClass: req.body.spClass,
        address: req.body.address,
        phone: req.body.phone,
        phone2: req.body.phone2,
        email: req.body.email,
        status: req.body.status,
        description: req.body.description,
    });
    sponsor = await sponsor.save();

    res.send(sponsor);
};
exports.updateSponsor = async (req, res) => {
    const { error } = validateSponsor(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        spClass: req.body.spClass,
        address: req.body.address,
        phone: req.body.phone,
        phone2: req.body.phone2,
        email: req.body.email,
        status: req.body.status,
        description: req.body.description,
    }, {
        new: true
    });

    if (!sponsor) return res.status(404).send('The Sponsor with the given ID was not found.');

    res.send(sponsor);
};


// exports.deleteSponsor = async (req, res) => {
//     const sponsor = await Sponsor.findByIdAndRemove(req.params.id);

//     if (!sponsor) return res.status(404).send('The Sponsor with the given ID was not found.');

//     res.send(sponsor);
// };

exports.deleteSponsor = async function (req, res, next) {
    Sponsor.findById(req.params.id, function (err, sponsor) {
        if (err) return next(err);
        sponsor.remove();
        res.status(200).send(sponsor);
    });
};

exports.getSponsorById = async (req, res) => {
    const sponsor = await Sponsor.findById(req.params.id);

    if (!sponsor) return res.status(404).send('The Sponsor with the given ID was not found.');

    res.send(sponsor);
};
