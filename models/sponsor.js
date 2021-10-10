const Joi = require('joi');
const mongoose = require('mongoose');
const { boolean, string } = require('joi');
const Advertisement = require('./advertisement');

const sponsorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    spClass: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Lookup',
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        // unique: true
    },
    phone2: {
        type: String,
        // unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    status: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

sponsorSchema.pre('remove', async function (next) {
    try {
        await Advertisement.Advertisement.find({ 'sponsor': this._id })
            .then((ads) => {
                Promise.all(ads.map(ad => ad.remove()))
                    .then(next());
            });
    } catch (error) {
        next(error);
    }
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

function validateSponsor(sponsor) {
    const schema = Joi.object({
        name: Joi.string().required(),
        spClass: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.string().required(),
        phone2: Joi.string(),
        email: Joi.string(),
        status: Joi.string().required(),
        description: Joi.string(),
    });
    const validation = schema.validate(sponsor);
    return validation;
}

exports.Sponsor = Sponsor;
exports.validateSponsor = validateSponsor;