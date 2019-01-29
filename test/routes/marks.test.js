const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);
const db = require('../../sql/db');


describe('routes : marks', () => {
  let marksNumber;
  before(async () => {
    await db.any('select * from oceny_uzytkownika($1);', userId)
      .then(data => marksNumber = data.length)
      .catch(error => console.error(error));
  });
  const prefix = `/marks`;
  const userId = 1;
  const userWithNoMarks = 16;
  const cocktailId = 230;

  describe('GET Method', () => {
    it('should return list of user\' marks', (done) => {
      chai.request(server)
        .get(`${prefix}/${userId}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.marks.should.not.be.undefined;
          res.body.marks.length.should.eql(marksNumber);
          res.body.marks.map(ing => ing.should.include.keys('id', 'name', 'mark'));
          done();
        });
    });

    it('should return empty list of user\' marks', (done) => {
      chai.request(server)
        .get(`${prefix}/${userWithNoMarks}`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.marks.should.not.be.undefined;
          res.body.marks.length.should.eql(0);
          done();
        });
    });

    it('should return error due to non-existing user', (done) => {
      chai.request(server)
        .get(`${prefix}/10000`)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.message.should.not.be.undefined;
          res.body.message.should.eql('User with provided id does not exist.');
          done();
        });
    });
  });

  describe('POST Method', () => {
    after(async () => {
      await db.any('delete from oceny where id_uzytkownika = ${userId} and id_koktajlu = ${cocktailId};', { userId, cocktailId })
        .catch(error => console.error(error));
    });

    it('#should add mark and return list with all marks for provided user', done => {
      chai.request(server)
        .post(`${prefix}/${userId}/cocktail/${cocktailId}`)
        .send({ mark: 5 })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.marks.should.not.be.undefined;
          res.body.marks.should.to.deep.include({ id: 230, name: 'Sledgehammer', mark: 5 });
          done();
        });
    });

    it('#should return error due to already existing mark', done => {
      chai.request(server)
        .post(`${prefix}/${userId}/cocktail/${cocktailId}`)
        .send({ mark: 5 })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.message.should.not.be.undefined;
          res.body.message.should.eql('Mark with provided ids already exists.');
          done();
        });
    })
  });

  describe('PUT Method', () => {
    before(async () => {
      await db.any('select dodaj_ocene(${userId}, ${cocktailId}, ${mark});', { userId, cocktailId, mark: 5 })
        .catch(error => console.error(error));
    });

    after(async () => {
      await db.any('delete from oceny where id_uzytkownika = ${userId} and id_koktajlu = ${cocktailId};', { userId, cocktailId })
        .catch(error => console.error(error));
    });

    it('#should update mark and return list with all marks for provided user', done => {
      chai.request(server)
        .put(`${prefix}/${userId}/cocktail/${cocktailId}`)
        .send({ mark: 9 })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.marks.should.not.be.undefined;
          res.body.marks.should.to.deep.include({ id: 230, name: 'Sledgehammer', mark: 9 });
          done();
        });
    });

    it('#should return error due to non-existing mark', done => {
      chai.request(server)
        .put(`${prefix}/${userWithNoMarks}/cocktail/${cocktailId}`)
        .send({ mark: 4 })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.message.should.not.be.undefined;
          res.body.message.should.eql('Provided mark does not exists.');
          done();
        });
    })
  });
});
