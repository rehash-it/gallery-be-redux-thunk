const Joi = require('joi');
const mongoose = require('mongoose');
const { boolean, string } = require('joi');
const commentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    gallery_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallery',
        required: true
    },
    reply: {
        type: Boolean,
        req: true
    },
    reply_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Comment = mongoose.model('Comment', commentSchema);

function validateComment(comment) {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        gallery_id: Joi.string().required(),
        description: Joi.string().required(),
        reply: Joi.boolean().required()
    });
    const validation = schema.validate(comment);
    return validation;
}

exports.Comment = Comment;
exports.validateComment = validateComment;