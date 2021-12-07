const { Report, validateReport } = require("../models/report")
const APIFeatures = require('./../utils/APIFeatures');
const sendError = require('../utils/sendError');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getAllReports = async (req, res) => {
  const apiFeatures = new APIFeatures(Report.find().populate('lookup_id'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const report = await apiFeatures.query;
  if (!report) return sendError("No report founds yet", res, 404)
  res.send(report);
}
exports.getUserReports = async (req, res) => {
  const { user_id } = req.params
  if (!user_id) return sendError("please set user id", res, 404)
  const apiFeatures = new APIFeatures(Report.find({ user_id: new ObjectId(user_id) }).populate('lookup_id'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const report = await apiFeatures.query;
  if (!report) return sendError("No report founds yet", res, 404)
  res.send(report);
};
exports.galleryReports = async (req, res) => {
  const { gallery_id } = req.params
  const apiFeatures = new APIFeatures(Report.find({ gallery_id: new ObjectId(gallery_id) }).populate('lookup_id'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const report = await apiFeatures.query;
  if (!report) return sendError("No report founds yet", res, 404)
  res.send(report);
}
//checks if the user report before if it doesn't deport send a true to report to the gallery_id 
exports.checkReport = async (req, res) => {
  const { gallery_id } = req.params
  const { user_id } = req.query
  const report = await Report.findOne({ gallery_id: new ObjectId(gallery_id), user_id: new ObjectId(user_id) })
  if (report) return sendError("user has reported this gallery before", res, 400)
  res.send({ canReport: true })

}
exports.createReport = async (req, res) => {
  try {
    const { error } = validateReport(req.body);
    if (error) return sendError(error.details[0].message, res);

    let ReportSave = new Report(req.body);
    ReportSave = await ReportSave.save();

    res.send(ReportSave);
  }
  catch (err) {
    console.log(err)
    sendError('internal server error', res, 500)
  }
};


