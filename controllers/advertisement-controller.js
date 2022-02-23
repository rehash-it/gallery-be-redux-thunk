const { Advertisement, validateAdvertisement } = require('../models/advertisement');
const APIFeatures = require('./../utils/APIFeatures');


exports.getAdverts =async (req, res) => {
    const advertisements = await Advertisement.find({"status": "APPROVED"}).populate({ 
        path: 'sponsor',
        populate: {
          path: 'spClass',
          model: 'Lookup'
        } 
     }).select({});
    res.send(advertisements);
};
exports.getAdvertisement = async (req, res) => {
  
    const apiFeatures = new APIFeatures(Advertisement.find().populate('sponsor'), req.query)
     .filter()
     .sort()
     .limitFields()
     .paginate();
 
   const advertisement = await apiFeatures.query;
   if (!advertisement) return res.status(404).send('No advertisement(s) found with the provided data.');
   
   res.status(200).send(advertisement);
 };

exports.createAdvertisement = async (req, res) => {
    const { error } = validateAdvertisement(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let advertisement = new Advertisement({
        title: req.body.title,
        sponsor: req.body.sponsor,
        bannerPhotoUrl: req.body.bannerPhotoUrl,
        // paidAmount: req.body.paidAmount,
        from: req.body.from,
        to: req.body.to,
        status: req.body.status,
        description: req.body.description,
        url: req.body.url,
    });
    advertisement = await advertisement.save();
    res.send(advertisement);
};

exports.updateAdvertisement = async (req, res) => {
    const { error } = validateAdvertisement(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const advertisement = await Advertisement.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        sponsor: req.body.sponsor,
        bannerPhotoUrl: req.body.bannerPhotoUrl,
        // paidAmount: req.body.paidAmount,
        from: req.body.from,
        to: req.body.to,
        status: req.body.status,
        description: req.body.description,
        url: req.body.url,
    }, {
        new: true
    });

    if (!advertisement) return res.status(404).send('The Advertisement with the given ID was not found.');

    res.send(advertisement);
};


exports.deleteAdvertisement = async (req, res) => {
    const advertisement = await Advertisement.findByIdAndRemove(req.params.id);

    if (!advertisement) return res.status(404).send('The Advertisement with the given ID was not found.');

    res.send(advertisement);
};
exports.getAdvertisementById = async (req, res) => {
    const advertisement = await Advertisement.findById(req.params.id);

    if (!advertisement) return res.status(404).send('The Advertisement with the given ID was not found.');

    res.send(advertisement);
};
exports.getAdsByReqStatus = async (req, res) => {

    const advertisement = await Advertisement.find({ "status": "REQUEST" });
  
    if (!advertisement) return res.status(404).send('Advertisements with the given status was not found.');
  
    res.send(advertisement);
  
  };