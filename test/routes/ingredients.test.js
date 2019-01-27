const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);
const db = require('../../sql/db');


describe('routes : ingredients', () => {
  let ingredientsNumber;
  before(() => {
    db.any('select id_skladnika as id, nazwa as name from skladniki order by id;')
      .then(data => ingredientsNumber = data.length)
      .catch(error => console.error(error));
  });
  const prefix = `/ingredients`;

  describe('GET Method', () => {
    it('#should return list of ingredients', (done) => {
      chai.request(server)
        .get(`${prefix}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.ingredients.should.not.be.undefined;
          res.body.ingredients.length.should.eql(ingredientsNumber);
          res.body.ingredients.map(ing => ing.should.include.keys('id', 'name'));
          done();
        });
    })
  });

  describe('POST Method', () => {
    after(async () => {
      await db.any('SELECT * FROM usun_skladnik(${ingredientId});', { ingredientId: ingredientsNumber + 1 })
        .catch(error => console.error(error));
      await db.any('ALTER SEQUENCE skladniki_id_skladnika_seq RESTART WITH $1;', ingredientsNumber + 1)
        .catch(error => console.error(error));
    });

    it('#should add ingredient and return list with all', done => {
      chai.request(server)
        .post(`${prefix}`)
        .send({ name: 'Piwo z Tenczynka' })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.ingredients.should.not.be.undefined;
          res.body.ingredients.should.to.deep.include({
            id: ingredientsNumber + 1,
            name: 'Piwo z Tenczynka'
          });
          done();
        });
    })
  });

  describe('DELETE Method', () => {
    before(async () => {
      await db.any('SELECT * FROM dodaj_skladnik(${name});', { name: 'Piwo z Tenczynka' })
        .then(data => console.log(data.ingredients))
        .catch(error => console.error(error));
    });

    after(async () => {
      await db.any('ALTER SEQUENCE skladniki_id_skladnika_seq RESTART WITH $1;', ingredientsNumber + 1)
        .catch(error => console.error(error));
    });

    it('#should delete and return true', (done) => {
      chai.request(server)
        .delete(`${prefix}/${ingredientsNumber + 1}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.message.should.not.be.undefined;
          res.body.message.should.equal('Removed');
          done();
        });
    });
  });
});
