const { Faq, validateFaq } = require('../models/faq');
const APIFeatures = require('./../utils/APIFeatures');

exports.getFaq = async (req, res) => {
    const apiFeatures = new APIFeatures(Faq.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const faq = await apiFeatures.query;
    if (!faq) return res.status(404).send('No faq(s) found with the provided data.');

    res.status(200).send(faq);
};

exports.createFaq = async (req, res) => {
    const { error } = validateFaq(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let faq = new Faq({
        question: req.body.question,
        answer: req.body.answer,
        relevant: req.body.relevant,
        dateadded: req.body.dateadded,
    });
    faq = await faq.save();

    res.send(faq);
};

exports.updateFaq = async (req, res) => {
    const { error } = validateFaq(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const faq = await Faq.findByIdAndUpdate(req.params.id,
        {
            question: req.body.question,
            answer: req.body.answer,
            relevant: req.body.relevant,
            dateadded: req.body.dateadded,
        },
        {
            new: true
        });

    if (!faq) return res.status(404).send('The FAQ with the given ID was not found.');

    res.send(faq);
};


exports.deleteFaq = async (req, res) => {
    const faq = await Faq.findByIdAndRemove(req.params.id);

    if (!faq) return res.status(404).send('The FAQ with the given ID was not found.');

    res.send(faq);
};

exports.getFAQByQuestion = async (req, res) => {
    const faq = await Faq.find({ "question": req.params.question });

    if (!faq) return res.status(404).send('The FAQ with the given ID was not found.');

    res.status(200).send(faq);

};

exports.getFaqById = async (req, res) => {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).send('The Faq with the given ID was not found.');
    res.send(faq);
};