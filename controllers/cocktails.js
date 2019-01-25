const Joi = require('joi');
const pgp = require('pg-promise')();
const db = pgp('postgres://pszopa:@localhost:5432/pszopa');


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
  marks: 'marks',
};

const schemaQuery = Joi.object().keys({
  [queryTypes.ingredients]: Joi.number().greater(0).optional(),
  [queryTypes.name]: Joi.string().min(0, 'utf-8').optional(),
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
          let cocktailsByIngredients = await db.any('SELECT id_koktajlu, koktajl FROM koktajl_bar.przepisy_po_ilosci_skladnikow WHERE ilosc_skladnikow = ${ingredients};', value)
            .catch(error => console.log('ERROR:', error));

          res.json({ cocktails: cocktailsByIngredients });
          break;

        case queryTypes.name:
          const data = await db.any('SELECT * FROM koktajl_bar.Przepisy WHERE koktajl = ${name};', value)
            .catch(error => console.log('ERROR:', error));

          const cocktail = {
            id: data[0].id_koktajlu,
            name: data[0].koktajl,
            recipe: data[0].tresc_instrukcji,
            ingredients: data.map(s => ({
              name: s.skladnik,
              amount: s.ilosc,
              measure: s.miara
            }))
          };
          res.json({ cocktail });
          break;

        case queryTypes.bar:
        case queryTypes.marks:
        default:
          // Wszystkie: SELECT k.id_koktajlu, k.nazwa FROM koktajle k; kursor? paginacja? 7.6. LIMIT and OFFSET
          db.any('SELECT k.id_koktajlu, k.nazwa FROM koktajl_bar.koktajle k;')
            .then(cocktails => res.json({ cocktails }))
            .catch(error => console.log('ERROR:', error));
      }
    }
  }),
  cocktailDetail: async (req, res) => Joi.validate(req.params, schemaParams, async (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA });
    } else {
      const data = await db.any('SELECT * FROM koktajl_bar.Przepisy WHERE id_koktajlu = ${id};', value)
        .catch(error => console.log('ERROR:', error));

      const cocktail = {
        id: data[0].id_koktajlu,
        name: data[0].koktajl,
        recipe: data[0].tresc_instrukcji,
        ingredients: data.map(s => ({
          name: s.skladnik,
          amount: s.ilosc,
          measure: s.miara
        }))
      };
      res.json({ cocktail });
    }
  }),
  top10Cocktails: (req, res) => db.any('SELECT * FROM koktajl_bar.nazwy_po_ocenach LIMIT 10;')
    .then(cocktails => res.json({ cocktails }))
    .catch(error => console.log('ERROR:', error)),
  randomCocktail: async (req, res) => {
    const data = await db.any('select * FROM koktajl_bar.losowy_koktajl();')
      .catch(error => console.log('ERROR:', error));
    const cocktail = {
      id: data[0].id,
      name: data[0].koktajl,
      recipe: data[0].instrukcja,
      ingredients: data.map(s => ({
        name: s.skladnik,
        amount: s.ilosc,
        measure: s.miara
      }))
    };
    res.json({ cocktail });
  },
  createCocktail: async (req, res) => Joi.validate(req.body, schemaBody, async (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA });
    } else {
      // await db.one('SELECT * FROM koktajl_bar.dodaj_koktajl_uzytkownika(1, ${name}, ${recipe}, ${ingredients});', testCocktail)
      //   .catch(error => console.log('ERROR:', error));

      const data = await db.one('SELECT * FROM koktajl_bar.dodaj_koktajl_uzytkownika(1, ${name}, ${recipe}, ${ingredients:json});', value)
        .catch(error => console.error(error));

      res.json({ cocktail: data });
    }
  }),
  updateCocktail: async (req, res) => Joi.validate(req.body, schemaBody, async (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA });
    } else {
      const data = await db.one('SELECT * FROM aktualizuj_koktajl(${id}, ${name}, ${recipe}, ${ingredients});', value)
        .catch(error => console.log('ERROR:', error));

      res.json({ cocktail: data });
    }
  }),
  deleteCocktail: async (req, res) => Joi.validate(req.params, schemaParams, async (err, value) => {
    if (err) {
      res.status(422).json({ message: MESSAGES.ERRORS.INVALID_REQUEST_DATA });
    } else {
      const data = await db.one('SELECT * FROM koktajl_bar.usun_koktajl_uzytkownika(${id})', value)
        .catch(error => console.log('ERROR:', error));

      res.json({
        message: data.usun_koktajl_uzytkownika > 0
          ? MESSAGES.DELETE.REMOVED
          : MESSAGES.DELETE.NOTHING_REMOVED
      });
    }
  })
};

module.exports = Cocktails;
