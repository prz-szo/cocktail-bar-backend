const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;


describe('routes : cocktails', () => {
  const prefix = '/cocktails';
  describe('GET Method', () => {
    describe('GET /', () => {
      it('should respond with all cocktails', (done) => {
        chai.request(server)
          .get(`${prefix}`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.cocktails.map(cocktail => {
              expect(cocktail).to.have.property('id_koktajlu');
              expect(cocktail).to.have.property('nazwa');
            });
            done();
          });
      });
    });

    describe(`GET ${prefix}?q=find`, () => {
      it.skip('should respond with all cocktails meeting query', (done) => {
        chai.request(server)
          .get(`${prefix}?q=find`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.length.should.eql(1);
            done();
          });
      });
    });

    describe(`GET ${prefix}/:id`, () => {
      it('should respond with specific cocktail details', (done) => {
        chai.request(server)
          .get(`${prefix}/1`)
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
    });

    describe(`GET ${prefix}/top10`, () => {
      it('should respond with top 10 rated cocktails', (done) => {
        chai.request(server)
          .get(`${prefix}/top10`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.cocktails.length.should.lessThan(11);
            done();
          });
      });
    });

    describe(`GET ${prefix}/random`, () => {
      it('should respond with random cocktail detail', (done) => {
        chai.request(server)
          .get(`${prefix}/random`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.message.should.eql('losowy koktajl');
            done();
          });
      });
    });
  });

  describe('POST Method', ()=> {
    describe('POST /', () => {
      it('should respond with all cocktails', (done) => {
        chai.request(server)
          .post(`${prefix}`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.message.should.eql('Stworzenie nowego koktajlu');
            done();
          });
      });
    });
  });

  describe('PUT Method', ()=> {
    describe('PUT /:id', () => {
      it('should respond with all cocktails', (done) => {
        chai.request(server)
          .put(`${prefix}/1`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.message.should.eql('Update koktajlu 1');
            done();
          });
      });
    });
  });

  describe('DELETE Method', ()=> {
    describe('DELETE /:id', () => {
      it('should respond with all cocktails', (done) => {
        chai.request(server)
          .delete(`${prefix}/1`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.message.should.eql('Usuniecie koktajlu');
            done();
          });
      });
    });
  });
});