const Joi = require('joi');
const db = require('../sql/db');
const Validator = require('../utils/validate');


const MESSAGES = {
  ERRORS: {
    INVALID_REQUEST_DATA: 'Invalid request data',
  },
  DELETE: {
    REMOVED: 'Removed',
    NOTHING_REMOVED: 'Nothing has been removed'
  }
};

const schemaParams = Joi.object().keys({
  ingredientId: Joi.number().integer().positive().required()
});

const schemaBody = Joi.object().keys({
  name: Joi.string().min(1, 'utf-8').max(100, 'utf-8').required()
});


const listAll = (req, res) => {
  db.any('select id_skladnika as id, nazwa as name from skladniki order by id;')
    .then(ingredients => res.json({ ingredients }))
    .catch(error => console.log('ERROR:', error));
};

const addProduct = (req, res) => Validator(req.body, schemaBody, res, value => {
  db.any('select * from dodaj_skladnik(${name});', value)
    .then(ingredients => res.json({ ingredients }))
    .catch(error => console.log('ERROR:', error))
});

const deleteProduct = (req, res) => Validator(req.params, schemaParams, res, value => {
  db.one('SELECT * FROM usun_skladnik(${ingredientId});', value)
    .then(data => res.json({
      message: data.usun_skladnik
        ? MESSAGES.DELETE.REMOVED
        : MESSAGES.DELETE.NOTHING_REMOVED
    }))
    .catch(error => console.log('ERROR:', error))
});

module.exports = {
  listAll,
  addProduct,
  deleteProduct
};
