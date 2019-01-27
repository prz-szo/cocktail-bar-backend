const Joi = require('joi');

module.exports = (objToValidate, schema, res, callback) => Joi.validate(objToValidate, schema, (err, value) => {
  if (err) {
    console.log(value);
    res.status(422).json({ message: 'Invalid request data' })
  } else {
    callback(value);
  }
});
