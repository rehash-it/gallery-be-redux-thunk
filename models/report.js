const Joi = require('joi');
const mongoose = require('mongoose');
const { boolean, string } = require('joi');
const reportSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lookup_id:{
        type: [mongoose.Schema.Types.ObjectId], //array
        ref: "Lookup",
        required: true
    },
    gallery_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Report = mongoose.model('Report', reportSchema);

function validateReport(report) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        gallery_id: Joi.string().required(),
        lookup_id: Joi.array().required()
    });
    const validation = schema.validate(report);
    return validation;
}

exports.Report = Report;
exports.validateReport = validateReport;