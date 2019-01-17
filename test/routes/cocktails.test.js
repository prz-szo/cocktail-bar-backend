const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const router = require('../../routes/cocktails');
chai.use(chaiHttp);

const server = require('../../app');


describe('routes : cocktails', () => {
  describe('GET /cocktails', () => {
    it('should respond with all cocktails', (done) => {
      chai.request(server)
        .get('/cocktails')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.message.should.eql('Lista wszystkich koktajli with query {}');
          done();
        });
    });
  });

  describe('GET /cocktails?q=find', () => {
    it('should respond with all cocktails', (done) => {
      chai.request(server)
        .get('/cocktails?q=find')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.message.should.eql('Lista wszystkich koktajli with query {"q":"find"}');
          done();
        });
    });
  });

});