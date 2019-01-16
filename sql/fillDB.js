var pgp = require('pg-promise')(/*options*/);
var db = pgp('postgres://pszopa:@localhost:5432/pszopa');

db.any('select * from koktajl_bar.uzytkownik;')
  .then(function (data) {
    console.log('DATA:', data)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  });
