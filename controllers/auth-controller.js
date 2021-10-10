const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');

exports.auth=async (req, res) => {
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

  function validate(req) {
    const schema = Joi.object({
      username: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(5).max(255).required()
    });
    const validation = schema.validate(req);
    return validation;
  }
  
