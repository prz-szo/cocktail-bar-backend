const db = require('../sql/db');


const measurements = require('../jsonData/miary.json');
const ingredients = require('../jsonData/skladniki.json');
const recipes = require('../jsonData/cocktails_289.json');


function fillAll() {
  // await db.any(sql('./create_db.sql'));
  fillMeasurements()
    .then(() => fillIngredients())
    .then(() => fillRecipes());
  // await db.any(sql('./exampleData.sql'));
}

fillAll();


function fillMeasurements() {
  return Promise.all(Object.keys(measurements).map((measurement, index) => {
    db.any('INSERT INTO miary(id_miary, nazwa) VALUES($1, $2)', [index + 1, measurement])
      .catch(error => console.log('ERROR:', error.detail));
  }))
    .then(() => db.any('ALTER SEQUENCE miary_id_miary_seq  RESTART WITH $1;', Object.keys(measurements).length + 1))
}

function fillIngredients() {
  return Promise.all(Object.keys(ingredients).map((ing, index) => {
    db.any('INSERT INTO skladniki(id_skladnika, nazwa) VALUES($1, $2)', [index + 1, ing])
      .catch(error => console.log('ERROR:', error.detail));
  }))
    .then(() => db.any('ALTER SEQUENCE skladniki_id_skladnika_seq  RESTART WITH $1;', Object.keys(ingredients).length + 1));
}

async function fillRecipes() {
  return Promise.all(Object.keys(recipes).map((recipe, index) => {
    db.any(
      'INSERT INTO Koktajle(id_koktajlu, nazwa, tresc_instrukcji) VALUES($1, $2, $3)',
      [index + 1, recipe, recipes[recipe].method.join('. ') + '.']
    ).then(() => {
        Object.values(recipes[recipe].ingredients).map(async value => {
          await db.any('INSERT INTO Koktajle_Skladniki(id_koktajlu, id_skladnika, ilosc, id_miary) VALUES($1, $2, $3, $4)',
            [index + 1, ingredients[value.ingredient], value.quantity, measurements[value.unit]]
          ).catch(error => console.log('ERROR:', error.detail));
        })
      })
      .catch(error => console.log('ERROR:', error.detail));
  }))
    .then(() => db.any('ALTER SEQUENCE koktajle_id_koktajlu_seq  RESTART WITH $1;', Object.keys(recipes).length + 1));
}
