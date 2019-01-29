const Joi = require('joi');

module.exports = (objToValidate, schema, res, callback) => Joi.validate(objToValidate, schema, (err, value) => {
  if (err) {
    res.status(422).json({ message: 'Invalid request data' })
  } else {
    callback(value);
  }
});
