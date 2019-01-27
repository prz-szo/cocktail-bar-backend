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

const queryTypes = {
  ingredients: 'ingredients',
  name: 'name',
  bar: 'bar',
  mark: 'mark',
  ingredientsSet: 'ingredientsSet[]'
};

const schemaQuery = Joi.object().keys({
  [queryTypes.ingredients]: Joi.number().greater(0).optional(),
  [queryTypes.name]: Joi.string().min(0, 'utf-8').optional(),
  [queryTypes.mark]: Joi.number().min(1).max(10).optional(),
});

const schemaParams = Joi.object().keys({
  id: Joi.number().integer().positive().required()
});

const schemaBody = Joi.object().keys({
  id: Joi.number().positive().optional(),
  name: Joi.string().min(1, 'utf-8').max(120, 'utf-8').required(),
  recipe: Joi.string().min(1, 'utf-8').max(1500, 'utf-8').required(),
  ingredients: Joi.array().items(
    Joi.object({
      name: Joi.string().min(1, 'utf-8').max(100, 'utf-8').required(),
      amount: Joi.number().min(.01).max(9999.99).required(),
      measure: Joi.string().min(1, 'utf-8').max(20, 'utf-8').required()
    })
  ).min(1).required()
});

const Cocktails = {
  listAllCocktails: async (req, res) => Joi.validate(req.query, schemaQuery, async (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA });
    } else {
      switch (Object.keys(value)[0]) {
        case queryTypes.ingredients:
          let cocktailsByIngredients = await db.any('SELECT id, name FROM przepisy_po_ilosci_skladnikow WHERE ingredients_number = ${ingredients};', value)
            .catch(error => console.log('ERROR:', error));

          res.json({ cocktails: cocktailsByIngredients });
          break;

        case queryTypes.name:
          const data = await db.any('SELECT * FROM Przepisy WHERE name = ${name};', value)
            .catch(error => console.log('ERROR:', error));

          if (data.length === 0) {
            res.json({ message: 'No results' });
          } else {
            const cocktail = {
              id: data[0].id,
              name: data[0].name,
              recipe: data[0].recipe,
              ingredients: data.map(s => ({
                name: s.ingredient,
                amount: +s.amount,
                measure: s.measure
              }))
            };
            res.json({ cocktail });
          }
          break;

        case queryTypes.mark:
          db.any('SELECT * FROM nazwy_po_ocenach WHERE avg_mark <= ${mark};', value)
            .then(cocktails => res.json({ cocktails }))
            .catch(error => console.log('ERROR:', error));
          break;

        case queryTypes.bar:
        default:
          // Wszystkie: SELECT k.id_koktajlu, k.nazwa FROM koktajle k; kursor? paginacja? 7.6. LIMIT and OFFSET
          db.any('SELECT k.id_koktajlu AS id, k.nazwa AS name FROM koktajle k;')
            .then(cocktails => res.json({ cocktails }))
            .catch(error => console.log('ERROR:', error));
      }
    }
  }),
  cocktailDetail: async (req, res) => Joi.validate(req.params, schemaParams, async (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA });
    } else {
      const data = await db.any('SELECT * FROM Przepisy WHERE id = ${id};', value)
        .catch(error => console.log('ERROR:', error));

      if (data.length === 0) {
        res.status(200).json({ message: 'Not found specific cocktail' })
      } else {
        const cocktail = {
          id: data[0].id,
          name: data[0].name,
          recipe: data[0].recipe,
          ingredients: data.map(s => ({
            name: s.ingredient,
            amount: +s.amount,
            measure: s.measure
          }))
        };
        res.json({ cocktail });
      }
    }
  }),
  top10Cocktails: (req, res) => db.any('SELECT id, name, avg_mark::numeric(6,2) FROM nazwy_po_ocenach LIMIT 10;')
    .then(cocktails => res.json({ cocktails }))
    .catch(error => console.log('ERROR:', error)),
  randomCocktail: async (req, res) => {
    const data = await db.any('select * FROM losowy_koktajl();')
      .catch(error => console.log('ERROR:', error));
    const cocktail = {
      id: data[0].id,
      name: data[0].name,
      recipe: data[0].recipe,
      ingredients: data.map(s => ({
        name: s.ingredient,
        amount: +s.amount,
        measure: s.measure
      }))
    };
    res.json({ cocktail });
  },
  createCocktail: (req, res) => Joi.validate(req.body, schemaBody, (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA });
    } else {
      db.one('SELECT * FROM dodaj_koktajl_uzytkownika(1, ${name}, ${recipe}, ${ingredients:json}) AS id;', value)
        .then(data => res.json({
          cocktail: {
            id: data.id
          }
        }))
        .catch(error => res.json({ message: error.hint }));
    }
  }),
  updateCocktail: (req, res) => Joi.validate(req.body, schemaBody, (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA });
    } else {
      db.one('SELECT * FROM aktualizuj_koktajl(${id}, ${name}, ${recipe}, ${ingredients:json}) AS id;', value)
        .then(data => res.json({ message: `Updated ${data.id}` }))
        .catch(error => {
          res.json({ message: error.hint })
        });
    }
  }),
  deleteCocktail: (req, res) => Joi.validate(req.params, schemaParams, (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA });
    } else {
      db.one('SELECT * FROM usun_koktajl_uzytkownika(${id}) AS did_delete;', value)
        .then(data => res.json({
          message: data.did_delete
            ? MESSAGES.DELETE.REMOVED
            : MESSAGES.DELETE.NOTHING_REMOVED
        }))
        .catch(error => console.log('ERROR:', error));
    }
  })
};

module.exports = Cocktails;
