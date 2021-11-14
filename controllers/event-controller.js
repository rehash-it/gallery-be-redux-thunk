const { Event, validateEvent } = require('../models/event');

exports.getEvent = async (req, res) => {
    const apiFeatures = new APIFeatures(Event.find().sort('description'), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const events = await apiFeatures.query;
    if (!events) return sendError("No Events founds yet", res, 404)
    const eventsCount = await Event.find().sort('description').countDocuments()
    res.send({ data: events, totall: eventsCount })
};

exports.createEvent = async (req, res) => {
    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // const location= await Lookup.findById(req.body.location);
    // if(!location) return res.status(400).send('Invalid Location');

    let event = new Event({
        description: req.body.description,
        eventyear: req.body.eventyear
    });
    event = await event.save();

    res.send(event);
};
exports.updateEvent = async (req, res) => {
    const { error } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // const location= await Lookup.findById(req.body.location);
    // if(!location) return res.status(400).send('Invalid Location');

    const event = await Event.findByIdAndUpdate(req.params.id, {
        description: req.body.description,
        eventyear: req.body.eventyear
    }, {
        new: true
    });

    if (!event) return res.status(404).send('The Event with the given ID was not found.');

    res.send(event);
};

// exports.deleteEvent =async (req, res) => {
//     const event = await Event.findByIdAndRemove(req.params.id);

//     if (!event) return res.status(404).send('The Event with the given ID was not found.');

//     res.send(event);
// };

exports.deleteEvent = async function (req, res, next) {
    Event.findById(req.params.id, function (err, event) {
        if (err) return next(err);
        event.remove();
        res.status(200).send(event);
    });
};
exports.getEventById = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).send('The Event Type with the given ID was not found.');

    res.send(event);
};