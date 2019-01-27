const Joi = require('joi');
const db = require('../sql/db');


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
  ingredientId: Joi.number().integer().positive().optional()
});

const schema = Joi.object().keys({
  params: {
    userId: Joi.number().integer().positive().required(),
    ingredientId: Joi.number().integer().positive().optional()
  },
  body: {
    ingredient: Joi.string().min(1, 'utf-8').max(100, 'utf-8').optional(),
    amount: Joi.number().min(.01).max(9999.99).required(),
    measure: Joi.string().min(1, 'utf-8').max(20, 'utf-8').required()
  }
});

const Bar = {
  listUserBar: (req, res) => Joi.validate(req.params, schemaParams, (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA })
    } else {
      db.any('SELECT id, ingredient, amount::float, measure FROM barek_uzytkownika(${userId});', value)
        .then(bar => res.json({ bar }))
        .catch(error => console.log('ERROR:', error))
    }
  }),
  addProduct: (req, res) => Joi.validate({ body: req.body, params: req.params }, schema, (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA })
    } else {
      db.any('select id, ingredient, amount::float, measure from dodaj_do_barku(${userId}, ${ingredient}, ${amount}, ${measure});', { ...value.body, ...value.params })
        .then(bar => res.json({ bar }))
        .catch(error => console.log('ERROR:', error))
    }
  }),
  deleteProduct: (req, res) => Joi.validate(req.params, schemaParams, (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA })
    } else {
      db.one('SELECT * FROM usun_z_barku(${userId}, ${ingredientId});', value)
        .then(data => res.json({ flag: data.usun_z_barku }))
        .catch(error => console.log('ERROR:', error))
    }
  }),
  updateProduct: (req, res) => Joi.validate({ body: req.body, params: req.params }, schema, (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA })
    } else {
      db.any('select id, ingredient, amount::float, measure from aktualizuj_barek(${userId}, ${ingredientId}, ${amount}, ${measure});', { ...value.body, ...value.params })
        .then(bar => res.json({ bar }))
        .catch(error => console.log('ERROR:', error))
    }
  })
};

module.exports = Bar;
