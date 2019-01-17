var pgp = require('pg-promise')(/*options*/);
var db = pgp('postgres://pszopa:@localhost:5432/pszopa');

const measurements = require('../jsonData/miary.json');
const ingredients = require('../jsonData/skladniki.json');
const recipes = require('../jsonData/recipes_3000.json');


measurements.map(measurement => {
  db.any('INSERT INTO koktajl_bar.miary(nazwa) VALUES($1)', measurement)
    .then(function (data) {
      console.log('DATA:', data)
    })
    .catch(function (error) {
      console.log('ERROR:', error)
    });
});

Object.keys(ingredients).map(ing => {
  db.any('INSERT INTO koktajl_bar.skladniki(nazwa) VALUES($1)', ing)
    .then(function (data) {
      console.log('DATA:', data)
    })
    .catch(function (error) {
      console.log('ERROR:', error)
    });
});

recipes.map(recipe => {
  // console.log(recipe.n, recipe.is);
  db.any('INSERT INTO koktajl_bar.Koktajle(nazwa, tresc_instrukcji) VALUES($1, $2)', [recipe.n, recipe.is])
    .then(function (data) {
      console.log('DATA:', data)
    })
    .catch(function (error) {
      console.log('ERROR:', error)
    });
});
