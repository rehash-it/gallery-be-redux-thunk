const Joi = require('joi');
const mongoose = require('mongoose');
const upcomingEventsSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    organizer: {
        type: String,
    },
    host: {
        type: String,
    },
    place: {
        type: String,
    },
    description: {
        type: String,
    },
    datefrom: {
        type: Date,
    },
    dateto: {
        type: Date,
    },
    imageurl: {
        type: String,
    },
    fee: {
        type: Number,
    }
});

const UpcomingEvents = mongoose.model('UpcomingEvents', upcomingEventsSchema);

function validateUpcomingEvents(upcomingEvents) {
    const schema = Joi.object({
        title: Joi.string().required(),
        organizer: Joi.string().required(),
        host: Joi.string().required(),
        datefrom: Joi.date(),
        dateto: Joi.date(),
        description: Joi.string().required(),
        place: Joi.string().required(),
        fee: Joi.number().required(),
        imageurl: Joi.string().required(),
    });
    const validation = schema.validate(upcomingEvents);
    return validation;
}

exports.UpcomingEvents = UpcomingEvents;
exports.validateUpcomingEvents = validateUpcomingEvents;