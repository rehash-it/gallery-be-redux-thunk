const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },

  password: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  account_type: {
    type: String,
    default: 'local'
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userType: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Lookup",
  },
  isModerator: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, keys.jwtPrivateKey);
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).allow(''),
    email: Joi.string().email().allow(''),
    isAdmin: Joi.boolean().required(),
    isActive: Joi.boolean().required(),
    account_type: Joi.string().allow(''),
    isModerator: Joi.boolean().required(),
    image: Joi.string().allow('')
  });
  const validation = schema.validate(user);
  return validation;
}


exports.User = User;
exports.validateUser = validateUser;