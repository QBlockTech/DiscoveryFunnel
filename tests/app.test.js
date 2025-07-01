const request = require('supertest');
const app = require('../src/app');

describe('DiscoveryFunnel API', () => {
  const API_KEY = 'test-api-key';
  
  beforeAll(() => {
    process.env.API_KEY = API_KEY;
    process.env.ICE_API_KEY = 'test-ice-key';
    process.env.ICE_BASE_URL = 'https://test-ice-api.com';
    process.env.NEON_DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  });

  describe('Health Check', () => {
    test('GET /health should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('Authentication', () => {
    test('should reject requests without API key', async () => {
      const response = await request(app)
        .get('/api/discovery/status')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Authentication Required');
    });

    test('should reject requests with invalid API key', async () => {
      const response = await request(app)
        .get('/api/discovery/status')
        .set('x-api-key', 'invalid-key')
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Authentication Failed');
    });

    test('should accept requests with valid API key', async () => {
      const response = await request(app)
        .get('/api/discovery/status')
        .set('x-api-key', API_KEY);

      // Status might be 503 due to service unavailability in test, but auth should pass
      expect([200, 503]).toContain(response.status);
    });
  });

  describe('Discovery API', () => {
    test('GET /api/discovery/status should return service status', async () => {
      const response = await request(app)
        .get('/api/discovery/status')
        .set('x-api-key', API_KEY);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('services');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('POST /api/discovery/workflow should handle workflow requests', async () => {
      const response = await request(app)
        .post('/api/discovery/workflow')
        .set('x-api-key', API_KEY);

      // Expect either success or controlled failure due to test environment
      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .set('x-api-key', API_KEY)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});