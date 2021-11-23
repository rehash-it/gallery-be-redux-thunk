const { GalleryCategory, validateGalleryCategory } = require('../models/gallery_category');
const APIFeatures = require('./../utils/APIFeatures');
exports.getGalleryCategory = async (req, res) => {
    const apiFeatures = new APIFeatures(GalleryCategory.find().sort('description'), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const albums = await apiFeatures.query;
    if (!albums) return sendError("No gallery founds yet", res, 404)
    res.send(albums);
};

exports.createGalleryCategory = async (req, res) => {
    const { error } = validateGalleryCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let galleryCategory = new GalleryCategory({ description: req.body.description, fileurl: req.body.fileurl });
    galleryCategory = await galleryCategory.save();

    res.send(galleryCategory);
};
exports.updateGalleryCategory = async (req, res) => {
    const { error } = validateGalleryCategory(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const galleryCategory = await GalleryCategory.findByIdAndUpdate(req.params.id, { description: req.body.description, fileurl: req.body.fileurl }, {
        new: true
    });

    if (!galleryCategory) return res.status(404).send('The Gallery Category with the given ID was not found.');

    res.send(galleryCategory);
};


// exports.deleteGalleryCategory =async (req, res) => {
//     const galleryCategory = await GalleryCategory.findByIdAndRemove(req.params.id);

//     if (!galleryCategory) return res.status(404).send('The Gallery Category with the given ID was not found.');

//     res.send(galleryCategory);
// };

exports.deleteGalleryCategory = async function (req, res, next) {
    GalleryCategory.findById(req.params.id, function (err, galleryCategory) {
        if (err) return next(err);
        galleryCategory.remove();
        res.status(200).send(galleryCategory);
    });
};

exports.getGalleryCategoryById = async (req, res) => {
    const galleryCategory = await GalleryCategory.findById(req.params.id);

    if (!galleryCategory) return res.status(404).send('The Gallery Category with the given ID was not found.');

    res.send(galleryCategory);
};
