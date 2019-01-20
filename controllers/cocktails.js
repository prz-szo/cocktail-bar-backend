const Joi = require('joi');
const pgp = require('pg-promise')();
const db = pgp('postgres://pszopa:@localhost:5432/pszopa');

const schemaBody = Joi.object().keys({
  query: {
    q: Joi.string()
  }
});

const schemaParams = Joi.object().keys({
  id: Joi.number().integer().positive()
});

const Cocktails = {
  createCocktail: async (req, res) => {
    res.json({message: 'Stworzenie nowego koktajlu'});
  },
  listAllCocktails: async (req, res) => {
    // Wszystkie: SELECT k.id_koktajlu, k.nazwa FROM koktajle k;
    // kursor? paginacja?
    // Po ilosci skladnikow: SELECT * FROM koktajl_bar.PrzepisyPoIlosciSkladnikow;
    //

    Joi.validate(req.body, schemaBody, async (err, value) => {
      if (err) {
        res.status(422).json({
          message: 'Invalid request data'
        });
      } else {
        const data = await db.any('SELECT k.id_koktajlu, k.nazwa FROM koktajl_bar.koktajle k;')
          .catch(error => console.log('ERROR:', error));
        res.json({cocktails: data});
      }
    });
  },
  cocktailDetail: async (req, res) => {
    Joi.validate(req.params, schemaParams, async (err, value) => {
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
    });
  },
  top10Cocktails: async (req, res) => {
    const top10Cocktails = await db.any('SELECT k.id_koktajlu, k.nazwa FROM koktajl_bar.koktajle k LIMIT 10;')
      .catch(error => console.log('ERROR:', error));
    res.json({cocktails: top10Cocktails});
  },
  randomCocktail: async (req, res) => {
    res.json({message: 'losowy koktajl'});
  },
  updateCocktail: async (req, res) => {
    res.json({message: `Update koktajlu ${req.params.id}`})
  },
  deleteCocktail: async (req, res) => {
    res.json({message: 'Usuniecie koktajlu'})
  }
};

module.exports = Cocktails;