const Joi = require('joi');
const db = require('../sql/db');
const Validator = require('./validate');


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
  userId: Joi.number().integer().positive().required(),
  cocktailId: Joi.number().integer().positive().optional()
});

const schema = Joi.object().keys({
  userId: Joi.number().integer().positive().required(),
  cocktailId: Joi.number().integer().positive().required(),
  mark: Joi.number().min(1).max(10).required()
});


const userMarks = (req, res) => Validator(req.params, schemaParams, res, value => {
  db.any('select * from oceny_uzytkownika(${userId});', value)
    .then(marks => res.json({ marks }))
    .catch(error => res.status(200).json({ message: error.hint }))
});

const addMark = (req, res) => Validator({ ...req.body, ...req.params }, schema, res, value => {
  db.any('select dodaj_ocene(${userId}, ${cocktailId}, ${mark});', value)
    .then(() => userMarks(req, res))
    .catch(error => res.status(200).json({ message: error.hint }))
});

const updateMark = (req, res) => Validator({ ...req.body, ...req.params }, schema, res, value => {
  db.one('SELECT * FROM aktualizuj_ocene(${userId}, ${cocktailId}, ${mark});', value)
    .then(() => userMarks(req, res))
    .catch(error => res.status(200).json({ message: error.hint }))
});

module.exports = {
  addMark,
  userMarks,
  updateMark
};
