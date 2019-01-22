const Joi = require('joi');
const pgp = require('pg-promise')();
const db = pgp('postgres://pszopa:@localhost:5432/pszopa');


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
  id: Joi.number().positive().required(),
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
  // Wszystkie: SELECT k.id_koktajlu, k.nazwa FROM koktajle k;
  // kursor? paginacja?
  // Po ilosci skladnikow: SELECT * FROM koktajl_bar.PrzepisyPoIlosciSkladnikow;
  //
  listAllCocktails: async (req, res) => Joi.validate(req.query, schemaQuery, async (err, value) => {
    if (err) {
      res.status(422).json({ message: 'Invalid request data' });
    } else {
      switch (Object.keys(value)[0]) {
        case queryTypes.ingredients:
          let cocktailsByIngredients = await db.any('SELECT id_koktajlu, koktajl FROM koktajl_bar.przepisypoilosciskladnikow WHERE ilosc_skladnikow = $1;', value.ingredients)
            .catch(error => console.log('ERROR:', error));
          res.json({cocktails: cocktailsByIngredients});
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
          res.json({cocktail});
          break;

        case queryTypes.bar:
        case queryTypes.marks:
        default:
          let cocktails = await db.any('SELECT k.id_koktajlu, k.nazwa FROM koktajl_bar.koktajle k;')
            .catch(error => console.log('ERROR:', error));
          res.json({cocktails});
      }
    }
  }),
  cocktailDetail: async (req, res) => Joi.validate(req.params, schemaParams, async (err, value) => {
    if (err) {
      res.status(422).json({
        message: 'Invalid request data'
      });
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
      res.json({cocktail});
    }
  }),
  top10Cocktails: async (req, res) => {
    const top10Cocktails = await db.any('SELECT * FROM koktajl_bar.NazwyPoOcenach LIMIT 10;')
      .catch(error => console.log('ERROR:', error));
    res.json({cocktails: top10Cocktails});
  },
  randomCocktail: async (req, res) => {
    const data = await db.any('select * FROM koktajl_bar.random_koktajl();')
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
    res.json({cocktail});
  },
  createCocktail: async (req, res) => Joi.validate(req.body, schemaBody, async (err, value) => {
    if (err) {
      res.status(422).json({
        message: 'Invalid request data'
      });
    } else {
      // const data = await db.any('SELECT k.id_koktajlu, k.nazwa FROM koktajl_bar.koktajle k;')
      //   .catch(error => console.log('ERROR:', error));
      // res.json({cocktails: data});
      res.json({message: `Update koktajlu ${value}`})
    }
  }),
  updateCocktail: async (req, res) => Joi.validate(req.body, schemaBody, async (err, value) => {
    if (err) {
      res.status(422).json({ message: 'Invalid request data' });
    } else {
      // const data = await db.any('SELECT k.id_koktajlu, k.nazwa FROM koktajl_bar.koktajle k;')
      //   .catch(error => console.log('ERROR:', error));
      // res.json({cocktails: data});
      res.json({message: `Update koktajlu ${value}`})
    }
  }),
  deleteCocktail: async (req, res) => Joi.validate(req.params, schemaParams, async (err, value) => {
    if (err) {
      res.status(422).json({ message: 'Invalid request data' });
    } else {
      // DELETE
      res.json({cocktail});
    }
  })
};

module.exports = Cocktails;