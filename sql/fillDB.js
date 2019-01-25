const pgp = require('pg-promise')(/*options*/);
const db = pgp('postgres://pszopa:@localhost:5432/pszopa');

const QueryFile = pgp.QueryFile;
const path = require('path');

async function sql(file) {
  const fullPath = path.join(__dirname, file);
  return new QueryFile(fullPath, {minify: true});
}

const measurements = require('../jsonData/miary.json');
const ingredients = require('../jsonData/skladniki.json');
const recipes = require('../jsonData/cocktails_289.json');


async function fillAll() {
  await sql('./create_db.sql');
  await fillMeasurements();
  await fillIngredients();
  await fillRecipes();
  console.log('DB ready!');
}

fillAll();


async function fillMeasurements() {
  await Object.keys(measurements).map( async (measurement, index) => {
    await db.any('INSERT INTO koktajl_bar.miary(id_miary, nazwa) VALUES($1, $2)', [index+1, measurement])
      .catch(function (error) {
        console.log('ERROR:', error)
      });
  });

  db.any('ALTER SEQUENCE koktajl_bar.miary_id_miary_seq  RESTART WITH $1;', Object.keys(measurements).length + 1);
}

async function fillIngredients() {
  await Object.keys(ingredients).map(async (ing, index) => {
    await db.any('INSERT INTO koktajl_bar.skladniki(id_skladnika, nazwa) VALUES($1, $2)', [index+1, ing])
      .catch(function (error) {
        console.log('ERROR:', error)
      });
  });

  db.any('ALTER SEQUENCE koktajl_bar.skladniki_id_skladnika_seq  RESTART WITH $1;', Object.keys(ingredients).length + 1);
}

async function fillRecipes() {
  await Object.keys(recipes).map(async (recipe, index) => {
    await db.any(
      'INSERT INTO koktajl_bar.Koktajle(id_koktajlu, nazwa, tresc_instrukcji) VALUES($1, $2, $3)',
      [index+1, recipe, recipes[recipe].method.join('. ') + '.']
      ).then(function () {
        Object.values(recipes[recipe].ingredients).map(async value => {
          await db.any('INSERT INTO koktajl_bar.Koktajle_Skladniki(id_koktajlu, id_skladnika, ilosc, id_miary) VALUES($1, $2, $3, $4)',
            [index+1, ingredients[value.ingredient], value.quantity, measurements[value.unit]]
            ).catch(function (error) {
              console.log('ERROR:', error)
            });
        })
      })
      .catch(function (error) {
        console.log('ERROR:', error)
      });
  });

  db.any('ALTER SEQUENCE koktajl_bar.koktajle_id_koktajlu_seq  RESTART WITH $1;', Object.keys(recipes).length + 1);
}
