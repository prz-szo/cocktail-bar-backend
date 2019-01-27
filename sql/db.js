const pgp = require('pg-promise')({ schema: 'koktajl_bar' });
const db = pgp('postgres://pszopa:@localhost:5432/pszopa');

module.exports = db;
