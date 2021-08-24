const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/is-auth');

describe('AuthMiddleware', () => {
  it('Should throw an error if Authorization header is not present', () => {
    const req = {
      get: headerName => null,
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('Should throw an error if Authorization header is only one string', () => {
    const req = {
      get: headerName => 'abc',
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should throw an error if the token cannot be verified', () => {
    const req = {
      get: headerName => 'Bearer xyz',
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should yeld a userId after decoded token', () => {
    const req = {
      get: headerName => 'Bearer qweasdzxc',
    };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'abc' });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    jwt.verify.restore();
  });
});
