const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);

const db = require('../../sql/db');


describe('routes : bar', () => {
  const userId = 1;
  const prefix = `/bar/${userId}`;

  const testIngredient = {
    ingredient: 'cola',
    amount: 1300,
    measure: 'ml'
  };

  const ingredientId = 56;
  let barLength;

  before(() => {
    db.any('SELECT * FROM barek_uzytkownika(${userId});', { userId })
      .then(data => barLength = data.length)
      .catch(error => console.error(error));
  });

  describe('GET Method', () => {
    it('#should return user\'s bar', (done) => {
      chai.request(server)
        .get(`${prefix}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.bar.should.not.be.undefined;
          res.body.bar.map(ing => ing.should.include.keys('id', 'ingredient', 'amount', 'measure'));
          done();
        });
    });
  });

  describe('POST Method', () => {
    after( async() => {
      await db.any('SELECT * FROM usun_z_barku(${userId}, ${ingredientId});', { userId, ingredientId })
        .catch(error => console.error(error));
    });

    it('#should add and return user\'s bar', (done) => {
      chai.request(server)
        .post(`${prefix}`)
        .send(testIngredient)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.bar.should.not.be.undefined;
          res.body.bar.length.should.eql(barLength + 1);
          res.body.bar.map(ing => ing.should.include.keys('id', 'ingredient', 'amount', 'measure'));
          res.body.bar.should.to.deep.include({ id: ingredientId, ...testIngredient });
          done();
        });
    });
  });

  describe('DELETE Method', () => {
    before(async () => {
      await db.any('SELECT * FROM dodaj_do_barku(${userId}, ${ingredient}, ${amount}, ${measure});', {
        userId,
        ...testIngredient
      }).catch(error => console.error(error));
    });

    it('#should delete and return true', (done) => {
      chai.request(server)
        .delete(`${prefix}/ingredients/${ingredientId}`)
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

  describe('PUT Method', () => {
    before(async () => {
      await db.any('SELECT * FROM dodaj_do_barku(${userId}, ${ingredient}, ${amount}, ${measure})', {
        userId,
        ...testIngredient
      }).catch(error => console.error(error));
    });

    after(async () => {
      await db.any('SELECT * FROM usun_z_barku(${userId}, ${ingredientId});', { userId, ingredientId })
        .catch(error => console.error(error));
    });

    it('#should delete and return true', (done) => {
      chai.request(server)
        .put(`${prefix}/ingredients/${ingredientId}`)
        .send({ ...testIngredient, amount: 1000, measure: 'oz' })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.bar.should.not.to.be.undefined;
          res.body.bar.should.to.deep.include({
            id: ingredientId,
            ...testIngredient,
            amount: 1000,
            measure: 'oz'
          });
          done();
        });
    });
  });
});
