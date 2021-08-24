const expect = require('chai').expect;
const sinon = require('sinon');
const AuthController = require('../controllers/auth');
const User = require('../models/user');
const mongoose = require('mongoose');

describe('Auth Controller - Login', () => {
  it('Should throws an error with status code 500 if access database fails', done => {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    req = {
      body: {
        email: 'test@email.com',
        password: 'test123',
      },
    };

    AuthController.login(req, {}, () => {}).then(result => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });

    User.findOne.restore();
  });

  it('Should send a message with a valid user status for an existing user', done => {
    mongoose
      .connect(
        'mongodb+srv://matheus:nKaRQ9yS7flsWZV8@cluster0.9nli6.mongodb.net/test-messages?retryWrites=true&w=majority',
        {
          useNewUrlParser: false,
          useUnifiedTopology: true,
          useFindAndModify: false,
        }
      )
      .then(result => {
        const user = new User({
          name: 'Matheus',
          email: 'test@test.com',
          password: 'test123',
          posts: [],
        });
        return user.save();
      })
      .then(user => {
        const req = { userId: user._id };
        const res = {
          statusCode: 500,
          userStatus: null,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.userStatus = data.status;
          },
        };
        AuthController.getUserStatus(req, res, () => {}).then(() => {
          expect(res.statusCode).to.be.equal(200);
          expect(res.userStatus).to.be.equal('I am new!');
          User.deleteMany({}).then(() => {
            return mongoose.disconnect().then(() => {
              done();
            });
          });
        });
      })
      .catch(err => console.log(err));
  });
});
