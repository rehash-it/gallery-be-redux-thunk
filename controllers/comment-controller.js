const { Comment, validateComment } = require("../models/comment")
const APIFeatures = require('./../utils/APIFeatures');
const sendError = require('../utils/sendError');

exports.getComments = async (req, res) => {
    const apiFeatures = new APIFeatures(Comment.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const comments = await apiFeatures.query;
    const commentsCount = await Comment.find().countDocuments()
    if (!comment) return sendError("No Comments yet", res, 404)
    res.send({ data: comments, totall: commentsCount });
};

exports.galleryComments = async (req, res) => {
    const { gallery_id } = req.params
    const apiFeatures = new APIFeatures(Comment.find({ gallery_id }).sort('description'), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const comments = await apiFeatures.query;
    const commentsCount = await Comment.find().countDocuments()
    if (!comments) return sendError("No Comments on this gallery", res, 404)
    res.send({ data: comments, totall: commentsCount });
}

exports.createComment = async (req, res) => {
    const { error } = validateComment(req.body);
    if (error) return sendError(error.details[0].message, res);

    let CommentSave = new Comment(req.body);
    CommentSave = await CommentCategory.save();

    res.send(CommentSave);
};
exports.updateComment = async (req, res) => {
    if (error) return sendError(error.details[0].message, res)

    const comment = await CommentCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!comment) return sendError('The Comment Category with the given ID was not found.');

    res.send(comment);
};


exports.deleteComment = async function (req, res, next) {
    Comment.findById(req.params.id, function (err, comment) {
        if (err) return next(err);
        comment.remove();
        res.status(200).send(comment);
    });
};

