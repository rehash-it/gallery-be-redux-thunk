const Joi = require('joi');
const mongoose = require('mongoose');
const { boolean, string } = require('joi');
const advertisementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique:true,
    },
    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Sponsor',
    },
    bannerPhotoUrl: {
        type: String,
        required: true,
        unique: true
    },
    // paidAmount: {
    //     type: Number,
    // },
    status: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Advertisement = mongoose.model('Advertisement', advertisementSchema);

function validateAdvertisement(advertisement) {
    const schema = Joi.object({
        title: Joi.string().required(),
        sponsor: Joi.string().required(),
        bannerPhotoUrl: Joi.string().required(),
        // paidAmount: Joi.number(),
        from: Joi.date().required(),
        to: Joi.date().required(),
        status: Joi.string().required(),
        description: Joi.string(),
    });
    const validation = schema.validate(advertisement);
    return validation;
}

exports.Advertisement = Advertisement;
exports.validateAdvertisement = validateAdvertisement;