const { Comment, validateComment } = require("../models/comment")
const APIFeatures = require('./../utils/APIFeatures');
const sendError = require('../utils/sendError');
const ObjectId = require('mongoose').Types.ObjectId;

const arrangeComments = comments => {
    let Comments = comments.map(c => {
        return {
            _id: c._id.toString(),
            key: c._id.toString(),
            gallery_id: c.gallery_id.toString(),
            reply: c.reply,
            reply_id: c.reply ? c.reply_id.toString() : '',
            user_id: {
                _id: c.user_id._id.toString(),
                email: c.user_id.email,
                username: c.user_id.username,
                account_type: c.user_id.account_type
            },
            title: c.description,
            children: null
        }
    })
    let map = {}, node, res = [], i;
    for (i = 0; i < Comments.length; i += 1) {
        map[Comments[i]._id] = i;
        Comments[i].children = [];
    };
    for (i = 0; i < Comments.length; i += 1) {
        node = Comments[i];
        if (node.reply_id) {
            Comments[map[node.reply_id]].children.push(node);
        }
        else {
            res.push(node);
        };
    };
    return res.reverse()
}
exports.getComments = async (req, res) => {
    const { page: p, limit: l } = req.query
    const comments = await Comment.find().populate('user_id')
    const arrangedComments = arrangeComments(comments)
    const page = parseInt(p)
    const limit = parseInt(l)
    let data = arrangedComments.slice(((page * limit) - limit), (page * limit))
    res.send(data)
};

exports.galleryComments = async (req, res) => {
    const { page: p, limit: l } = req.query
    const { gallery_id } = req.params
    const comments = await Comment.find({ gallery_id }).populate('user_id')
    const arrangedComments = arrangeComments(comments)
    const page = parseInt(p)
    const limit = parseInt(l)
    let data = arrangedComments.slice(((page * limit) - limit), (page * limit))
    res.send(data)
}

exports.createComment = async (req, res) => {
    try {
        const { error } = validateComment(req.body);
        if (error) return sendError(error.details[0].message, res);

        let CommentSave = new Comment(req.body);
        CommentSave = await CommentSave.save();

        res.send(CommentSave);
    }
    catch (err) {
        console.log(err)
        sendError('internal server error', res, 500)
    }
};
exports.updateComment = async (req, res) => {
    if (error) return sendError(error.details[0].message, res)

    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });

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

