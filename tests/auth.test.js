const authMiddleware = require('../src/middleware/auth');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res)
    };
    next = jest.fn();
    process.env.API_KEY = 'test-api-key';
  });

  test('should pass with valid API key in x-api-key header', () => {
    req.headers['x-api-key'] = 'test-api-key';

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should pass with valid API key in authorization header', () => {
    req.headers['authorization'] = 'test-api-key';

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should pass with valid API key with Bearer prefix', () => {
    req.headers['authorization'] = 'Bearer test-api-key';

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should reject request without API key', () => {
    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authentication Required',
      message: 'API key is required. Include it in x-api-key header'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should reject request with invalid API key', () => {
    req.headers['x-api-key'] = 'invalid-key';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Authentication Failed',
      message: 'Invalid API key'
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 500 if server API key not configured', () => {
    delete process.env.API_KEY;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Configuration Error',
      message: 'Server API key not configured'
    });
    expect(next).not.toHaveBeenCalled();
  });
});