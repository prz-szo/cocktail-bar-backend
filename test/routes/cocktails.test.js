const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const router = require('../../routes/cocktails');
chai.use(chaiHttp);

const server = require('../../app');


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
            res.body.message.should.eql('Lista wszystkich koktajli with query {}');
            done();
          });
      });
    });

    describe(`GET ${prefix}?q=find`, () => {
      it('should respond with all cocktails filling query', (done) => {
        chai.request(server)
          .get(`${prefix}?q=find`)
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.equal(200);
            res.type.should.equal('application/json');
            res.body.message.should.eql('Lista wszystkich koktajli with query {"q":"find"}');
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
            res.body.message.should.eql('szczegoly koktajlu 1');
            //res.body.data[0].should.include.keys(
            //         'id', 'username', 'email', 'created_at'
            //       );
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
            res.body.message.should.eql('Lista top 10 koktajli');
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