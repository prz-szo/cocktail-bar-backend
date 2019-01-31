const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const LoginHelper = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  generateToken(id) {
    return jwt.sign({
        userId: id
      },
      process.env.SECRET, { expiresIn: '1d' }
    );
  }
};

module.exports = LoginHelper;
