const expect = require('chai').expect;

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
});
