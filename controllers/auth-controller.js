const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { validateUser, User } = require('../models/user');
const sendError = require('../utils/sendError');

exports.auth = async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Invalid username or password.');

  if (!user.isActive) return res.status(400).send('Your account is currently Inactive. Please contact system adminstrator.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid username or password.');

  const token = user.generateAuthToken();
  res.send(token);
}
exports.checkUser = async (req, res) => {
  try {
    let token = req.header('x-auth-token');
    let { id } = req.params
    let user = await User.findOne({ _id: id });
    if (!token) return sendError('Invalid token!', res);
    if (!user) return sendError('Invalid user id!', res);
    res.send({ ..._.pick(user, ['_id', 'username', 'isAdmin', 'isActive', 'account_type', 'email', 'image']), token })
  }
  catch (err) {
    sendError('Internal server error', res)
  }
}
exports.signin = async (req, res) => {
  let account_type = req.body.account_type
  let user = await User.findOne({ email: req.body.email });
  let checkAccount = account_type ? (account_type === 'fb' || account_type === 'google') ? true : false : false
  if (!user && checkAccount) {
    this.signUp(req, res)
  }
  else if (!user.isActive) {
    return sendError('Your account is currently Inactive. Please contact system adminstrator.', res);
  }
  else if (user && (!checkAccount)) {
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return sendError('Invalid username or password.', res);
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({ ..._.pick(user, ['_id', 'username', 'isAdmin', 'isActive', 'account_type', 'email']), token });
  }
  else if (user && checkAccount) {
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send({ ..._.pick(user, ['_id', 'username', 'isAdmin', 'isActive', 'account_type', 'email']), token });
  }
  else {
    return sendError('Invalid username or password.', res);
  }
}
exports.signUp = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return sendError(error.details[0].message, res);
    console.log(req.body)
    let user = await User.findOne({ email: req.body.email });
    if (user) return sendError('User already registered.', res);
    user = new User(_.pick(req.body, ['username', 'email', 'password', 'isAdmin', 'isActive', 'account_type', 'image']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token)
      .send({ ..._.pick(user, ['_id', 'username', 'isAdmin', 'isActive', 'account_type', 'email', 'image']), token });

  }
  catch (err) {
    sendError('internal server error', res, 500)
  }

}
function validate(req) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required()
  });
  const validation = schema.validate(req);
  return validation;
}
