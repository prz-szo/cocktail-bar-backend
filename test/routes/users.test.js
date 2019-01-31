const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../../app');
chai.use(chaiHttp);
const db = require('../../sql/db');


describe('routes : users', () => {
  const prefix = '/users';
  const newUser = {
    email: 'newUser@o.pl',
    password: 'zaq1@WSX'
  };
  let usersNumbers;

  before(async () => {
    await db.any('select email from uzytkownik;')
      .then(data => usersNumbers = data.length)
      .catch(error => console.error(error));
  });

  describe('POST /', () => {
    after(async () => {
      await db.any('DELETE FROM uzytkownik WHERE email = ${email}', newUser);
      await db.any('ALTER SEQUENCE uzytkownik_id_uzytkownika_seq RESTART WITH $1;', usersNumbers + 1)
        .catch(error => console.error(error));
    });

    it('create user', done => {
      chai.request(server)
        .post(`${prefix}`)
        .send(newUser)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.token.should.not.be.undefined;
          done();
        });
    });

    it('raise error due to existing user', done => {
      chai.request(server)
        .post(`${prefix}`)
        .send(newUser)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(400);
          res.type.should.equal('application/json');
          res.body.message.should.not.be.undefined;
          res.body.message.should.to.deep.include('User with that email already exist');
          done();
        });
    });

    it('raise error due to missing request data', done => {
      chai.request(server)
        .post(`${prefix}`)
        .send({ email: newUser.email })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(422);
          res.type.should.equal('application/json');
          res.body.message.should.not.be.undefined;
          res.body.message.should.eql('Invalid request data');
          done();
        });
    });

    it('raise error due to invalid email', done => {
      chai.request(server)
        .post(`${prefix}`)
        .send({ ...newUser, email: 'admin' })
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

  describe('POST /login', () => {
    const passwordHash = '$2b$08$i7.J.JgzG7/Zkeudm1H1WO7Kenp/dQxvPkmVX8E7e4gKDvcrqnhT.';
    before(async () => {
      await db.any('INSERT INTO uzytkownik(email, haslo) VALUES(${email}, ${password})', {
        ...newUser,
        password: passwordHash
      });
    });

    after(async () => {
      await db.any('DELETE FROM uzytkownik WHERE email = ${email}', newUser);
      await db.any('ALTER SEQUENCE uzytkownik_id_uzytkownika_seq RESTART WITH $1;', usersNumbers + 1)
        .catch(error => console.error(error));
    });


    it('log in user and return response', done => {
      chai.request(server)
        .post(`${prefix}/login`)
        .send(newUser)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.token.should.not.be.undefined;
          done();
        });
    });

    it('return message \'Invalid login data\'', done => {
      chai.request(server)
        .post(`${prefix}/login`)
        .send({ ...newUser, password: 'panda' })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(400);
          res.type.should.equal('application/json');
          res.body.message.should.not.be.undefined;
          res.body.message.should.be.eql('The credentials you provided are incorrect');
          done();
        });
    });
  });

  describe('DELETE /', () => {
    const passwordHash = '$2b$08$i7.J.JgzG7/Zkeudm1H1WO7Kenp/dQxvPkmVX8E7e4gKDvcrqnhT.';
    before(async () => {
      await db.any('INSERT INTO uzytkownik(email, haslo) VALUES(${email}, ${password})', {
        ...newUser,
        password: passwordHash
      });
    });

    after(async () => {
      await db.any('ALTER SEQUENCE uzytkownik_id_uzytkownika_seq RESTART WITH $1;', usersNumbers + 1)
        .catch(error => console.error(error));
    });

    it('delete user and return response', done => {
      chai.request(server)
        .delete(`${prefix}`)
        .send(newUser)
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.message.should.eql('Deleted');
          done();
        });
    });

    it('return error', done => {
      chai.request(server)
        .delete(`${prefix}`)
        .send({ email: 'xD@co.pl' })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(422);
          res.type.should.equal('application/json');
          res.body.message.should.eql('Invalid request data');
          done();
        });
    });
  });
});
