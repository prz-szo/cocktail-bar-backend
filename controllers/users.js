const db = require('../sql/db');
const Helper = require('./loginHelper');
const Validate = require('../utils/validate');
const Joi = require('joi');


const schema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(4, 'utf-8').required()
});

const createUser = (req, res) => Validate(req.body, schema, res, async value => {
  const hashPassword = Helper.hashPassword(value.password);
  await db.any('INSERT INTO uzytkownik(email, haslo) values (${email}, ${password}) returning *;', {
      email: value.email,
      password: hashPassword
    })
    .then(data => {
      const token = Helper.generateToken(data[0].id_uzytkownika);
      return res.status(200).send({ token });
    })
    .catch(error => {
      if (error.constraint === 'uzytkownik_email_key') {
        return res.status(400).send({ message: 'User with that email already exist' })
      }
      return res.status(400).send({ error });
    });
});

const login = (req, res) => Validate(req.body, schema, res, async value =>
  await db.one('SELECT * FROM uzytkownik WHERE email = $1', value.email)
    .then(data => {
      if (!data || !Helper.comparePassword(data.haslo, value.password)) {
        return res.status(400).send({ message: 'The credentials you provided are incorrect' });
      }
      const token = Helper.generateToken(data.id_uzytkownika);
      return res.status(200).send({ token });
    })
    .catch(error => res.status(400).send(error)));

const deleteUser = (req, res) => Validate(req.body, schema, res, async value => {
  await db.any('DELETE FROM uzytkownik WHERE email=$1 returning *', value.email)
    .then(data => {
      if (!data[0]) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send({ message: 'Deleted' });
    }).catch(error => res.status(400).send(error));
});

module.exports = {
  createUser,
  login,
  deleteUser
};