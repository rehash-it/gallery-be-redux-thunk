const { UpcomingEvents, validateUpcomingEvents } = require('../models/upcoming_events');
const APIFeatures = require('./../utils/APIFeatures');

exports.getUpcomingEvent = async (req, res) => {
    const apiFeatures = new APIFeatures(UpcomingEvents.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const upcomingevent = await apiFeatures.query;
    if (!upcomingevent) return res.status(404).send('No Upcoming Event(s) found with the provided data.');

    res.status(200).send(upcomingevent);    
};

exports.createUpcomingEvent = async (req, res) => {
    const { error } = validateUpcomingEvents(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let upcomingevent = new UpcomingEvents({
        title: req.body.title,
        organizer: req.body.organizer,
        host: req.body.host,
        datefrom: req.body.datefrom,
        dateto: req.body.dateto,
        description: req.body.description,
        place: req.body.place,
        fee: req.body.fee,
        imageurl: req.body.imageurl
    });
    upcomingevent = await upcomingevent.save();

    res.send(upcomingevent);
};

exports.updateUpcomingEvent = async (req, res) => {
    const { error } = validateUpcomingEvents(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const upcomingevent = await UpcomingEvents.findByIdAndUpdate(req.params.id,
        {
            title: req.body.title,
            organizer: req.body.organizer,
            host: req.body.host,
            datefrom: req.body.datefrom,
            dateto: req.body.dateto,
            description: req.body.description,
            place: req.body.place,
            fee: req.body.fee,
            imageurl: req.body.imageurl
        },
        {
            new: true
        });

    if (!upcomingevent) return res.status(404).send('The Upcoming Event with the given ID was not found.');

    res.send(upcomingevent);
};

exports.deleteUpcomingEvent = async (req, res) => {
    const upcomingevent = await UpcomingEvents.findByIdAndRemove(req.params.id);

    if (!upcomingevent) return res.status(404).send('The Upcoming Event with the given ID was not found.');

    res.send(upcomingevent);
};

exports.getUpcomingEventByTitle = async (req, res) => {
    const upcomingevent = await UpcomingEvents.find({ "title": req.params.title });

    if (!upcomingevent) return res.status(404).send('The Upcoming Event with the given ID was not found.');

    res.status(200).send(upcomingevent);

};

exports.getOneEvent = async (req, res) => {
    const upcomingevent = await UpcomingEvents.findById(req.params.id);
    if (!upcomingevent) return res.status(404).send('The Upcoming Event with the given ID was not found.');

    res.send(upcomingevent);
};