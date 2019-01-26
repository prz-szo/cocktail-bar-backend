const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../app');

const pgp = require('pg-promise')({ schema: 'koktajl_bar' });

chai.use(chaiHttp);
const expect = chai.expect;

const now = new Date();


describe('routes : cocktails', () => {
  const prefix = '/cocktails';
  const cocktailId = 10;
  let db = pgp('postgres://pszopa:@localhost:5432/pszopa');

  describe('GET Method', () => {
    describe('GET /', () => {
      it('should respond with all cocktails', (done) => {
        chai.request(server)
          .get(`${prefix}`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.cocktails.should.not.be.undefined;
            res.body.cocktails.length.should.greaterThan(0);
            res.body.cocktails.map(cocktail => {
              expect(cocktail).to.have.property('id_koktajlu');
              expect(cocktail).to.have.property('nazwa');
            });
            done();
          });
      });
    });

    describe(`GET / with QUERY_STRING`, () => {
      describe('?ingredients', () => {
        it('should respond with all cocktails that have exact number of ingredients', (done) => {
          chai.request(server)
            .get(`${prefix}?ingredients=4`)
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(200);
              res.type.should.equal('application/json');
              res.body.cocktails.should.not.be.undefined;
              res.body.cocktails.length.should.greaterThan(0);
              res.body.cocktails.map(cocktail => cocktail.should.include.keys('id_koktajlu', 'koktajl'));
              done();
            });
        });

        it('should respond with error 422', (done) => {
          chai.request(server)
            .get(`${prefix}?ingredients=0`)
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(422);
              res.type.should.equal('application/json');
              res.body.message.should.not.be.undefined;
              res.body.message.should.eql('Invalid request data');
              done();
            });
        });
      });

      describe('?name', () => {
        it('should respond with cocktail detail', (done) => {
          chai.request(server)
            .get(`${prefix}?name=Allegheny`)
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(200);
              res.type.should.equal('application/json');
              res.body.cocktail.should.not.be.undefined;
              res.body.cocktail.should.include.keys('id', 'name', 'recipe', 'ingredients');
              res.body.cocktail.ingredients.map(ing => ing.should.include.keys('name', 'amount', 'measure'));
              done();
            });
        });

        it('should properly decode cocktail name and respond with cocktail detail', (done) => {
          chai.request(server)
            .get(`${prefix}?name=Affinity%20Cocktail`)
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(200);
              res.type.should.equal('application/json');
              res.body.cocktail.should.not.be.undefined;
              res.body.cocktail.should.include.keys('id', 'name', 'recipe', 'ingredients');
              res.body.cocktail.ingredients.map(ing => ing.should.include.keys('name', 'amount', 'measure'));
              done();
            });
        });

        it('should respond with message cocktail not found', (done) => {
          chai.request(server)
            .get(`${prefix}?name=qwerty123qweqweqwe`)
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(200);
              res.type.should.equal('application/json');
              res.body.should.not.include.keys('cocktail');
              done();
            });
        });
      });
    });

    describe(`GET /:id`, () => {
      it('should respond with specific cocktail details', (done) => {
        chai.request(server)
          .get(`${prefix}/${cocktailId}`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.cocktail.should.not.be.undefined;
            res.body.cocktail.should.include.keys('id', 'name', 'recipe', 'ingredients');
            res.body.cocktail.ingredients.map(ing => ing.should.include.keys('name', 'amount', 'measure'));
            done();
          });
      });

      it('should respond with message: Not found specific cocktail', (done) => {
        chai.request(server)
          .get(`${prefix}/1000000000000`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.message.should.not.be.undefined;
            res.body.message.should.equal('Not found specific cocktail');
            done();
          });
      });

      it('should respond with en error 422', (done) => {
        chai.request(server)
          .get(`${prefix}/0`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(422);
            res.type.should.equal('application/json');
            res.body.message.should.not.be.undefined;
            res.body.message.should.equal('Invalid request data');
            done();
          });
      });

      it('should respond with en error 404', (done) => {
        chai.request(server)
          .get(`${prefix}/-1`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(404);
            res.type.should.equal('application/json');
            res.body.message.should.not.be.undefined;
            res.body.message.should.equal('404 - Not Found');
            done();
          });
      });
    });

    describe(`GET /top10`, () => {
      it('should respond with top 10 most rated cocktails', (done) => {
        chai.request(server)
          .get(`${prefix}/top10`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.cocktails.should.not.be.undefined;
            res.body.cocktails.length.should.lessThan(11);
            res.body.cocktails.map(cocktail => cocktail.should.include.keys('id_koktajlu', 'nazwa', 'srednia_ocen'));
            done();
          });
      });
    });

    describe(`GET /random`, () => {
      it('should respond with random cocktail detail', (done) => {
        let cocktail1;
        chai.request(server)
          .get(`${prefix}/random`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.cocktail.should.not.be.undefined;
            res.body.cocktail.should.include.keys('id', 'name', 'recipe', 'ingredients');
            res.body.cocktail.ingredients.map(ing => ing.should.include.keys('name', 'amount', 'measure'));
            cocktail1 = res.body.cocktail;

            chai.request(server)
              .get(`${prefix}/random`)
              .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal('application/json');
                res.body.cocktail.should.not.be.undefined;
                res.body.cocktail.should.include.keys('id', 'name', 'recipe', 'ingredients');
                res.body.cocktail.ingredients.map(ing => ing.should.include.keys('name', 'amount', 'measure'));
                res.body.cocktail.should.not.eql(cocktail1);
                done();
              });
          });
      });
    });
  });

  describe('POST Method', () => {
    const cocktailToAdd = {
      name: `Cocktail ${now.toISOString()}`,
      recipe: 'Fill glass with ice. Add vermouths. Add club soda and stir. Add lemon twist.',
      ingredients: [
        {
          name: 'dry vermouth',
          amount: 45,
          measure: 'ml'
        },
        {
          name: 'sweet vermouth',
          amount: '45.00',
          measure: 'ml'
        },
        {
          name: 'club soda',
          amount: 120,
          measure: 'ml'
        }
      ]
    };

    describe('POST /', () => {
      it('should respond with added cocktail id', (done) => {
        chai.request(server)
          .post(`${prefix}`)
          .send(cocktailToAdd)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.cocktail.should.not.be.undefined;
            res.body.cocktail.should.include.keys('id');
            done();
          });
      });

      it('should respond with error due to not unique name', (done) => {
        chai.request(server)
          .post(`${prefix}`)
          .send(cocktailToAdd)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.message.should.not.be.undefined;
            res.body.message.should.eql('Please provide another name');
            done();
          });
      });

      describe('Invalid request', () => {
        it('# no name provided', (done) => {
          chai.request(server)
            .post(`${prefix}`)
            .send({ ...cocktailToAdd, name: "" })
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(422);
              res.type.should.equal('application/json');
              res.body.message.should.not.be.undefined;
              res.body.message.should.equal('Invalid request data');
              done();
            });
        });

        it('# name too long', (done) => {
          chai.request(server)
            .post(`${prefix}`)
            .send({ ...cocktailToAdd, name: "123".repeat(41) })
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(422);
              res.type.should.equal('application/json');
              res.body.message.should.not.be.undefined;
              res.body.message.should.equal('Invalid request data');
              done();
            });
        });

        it('# no recipe provided', (done) => {
          chai.request(server)
            .post(`${prefix}`)
            .send({ ...cocktailToAdd, recipe: "" })
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(422);
              res.type.should.equal('application/json');
              res.body.message.should.not.be.undefined;
              res.body.message.should.equal('Invalid request data');
              done();
            });
        });

        it('# no ingredients provided', (done) => {
          chai.request(server)
            .post(`${prefix}`)
            .send({ ...cocktailToAdd, ingredients: [] })
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(422);
              res.type.should.equal('application/json');
              res.body.message.should.not.be.undefined;
              res.body.message.should.equal('Invalid request data');
              done();
            });
        });
      });
    });
  });

  describe('PUT Method', () => {
    const cocktailToUpdate = {
      id: cocktailId,
      name: `Cocktail ${now.toDateString()}`,
      recipe: 'Add vermouths.',
      ingredients: [
        {
          name: 'dry vermouth',
          amount: 45,
          measure: 'ml'
        },
        {
          name: 'sweet vermouth',
          amount: '45.00',
          measure: 'ml'
        },
        {
          name: 'club soda',
          amount: 120,
          measure: 'ml'
        }
      ]
    };

    describe('PUT /:id', () => {
      it('should respond with message', (done) => {
        chai.request(server)
          .put(`${prefix}/${cocktailId}`)
          .send(cocktailToUpdate)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.message.should.eql(`Updated ${cocktailId}`);
            done();
          });
      });
    });
  });

  describe('DELETE Method', () => {
    let testCocktail;

    before(async () => {
      const data = await db.any('SELECT * FROM koktajl_bar.Przepisy WHERE id_koktajlu = $1;', cocktailId)
        .catch(error => console.log('ERROR:', error));

      testCocktail = {
        id: data[0].id_koktajlu,
        name: data[0].koktajl,
        recipe: data[0].tresc_instrukcji,
        ingredients: data.map(s => ({
          name: s.skladnik,
          amount: s.ilosc,
          measure: s.miara
        }))
      };
    });

    after(async () => {
      await db.any('INSERT INTO koktajle(id_koktajlu, nazwa, tresc_instrukcji) VALUES(${id}, ${name}, ${recipe})', testCocktail)
        .catch(error => console.log('ERROR:', error));
      await db.any('SELECT * FROM aktualizuj_koktajl(${id}, ${name}, ${recipe}, ${ingredients:json});', testCocktail)
        .catch(error => console.log('ERROR:', error));
    });

    describe('DELETE /:id', () => {
      it('should respond with already removed cocktail', (done) => {
        chai.request(server)
          .delete(`${prefix}/${cocktailId}`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.message.should.not.be.undefined;
            res.body.message.should.eql('Removed');
            done();
          });
      });

      it('should respond with message There is no such cocktail', (done) => {
        chai.request(server)
          .delete(`${prefix}/${cocktailId}`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.message.should.not.be.undefined;
            res.body.message.should.eql('Nothing has been removed');
            done();
          });
      });
    });
  });
});