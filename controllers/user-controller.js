const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUser } = require('../models/user');
const APIFeatures = require('./../utils/APIFeatures');


exports.getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
}

exports.createUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ username: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['username', 'password', 'isAdmin', 'isActive']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'isAdmin', 'isActive']));
};

exports.updateUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // let user = await User.findOne({ username: req.body.username });
  // if (user) return res.status(400).send('User already registered.');

  let user = User(_.pick(req.body, ['username', 'password', 'isAdmin', 'isActive']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await User.findByIdAndUpdate(req.params.id, {
    username: user.username,
    password: user.password,
    isAdmin: user.isAdmin,
    isActive: user.isActive
  }, {
    new: true
  }).select('-password');

  if (!user) return res.status(404).send('The User with the given ID was not found.');

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'isAdmin', 'isActive']));
};


exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id).select('-password');

  if (!user) return res.status(404).send('The User with the given ID was not found.');

  res.send(user);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) return res.status(404).send('The User with the given ID was not found.');

  res.send(user);
};

exports.getUsers = async (req, res) => {

  const apiFeatures = new APIFeatures(User.find().select('-password'), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await apiFeatures.query;
  if (!users) return res.status(404).send('No user(s) found with the provided data.');

  res.status(200).send(users);
};