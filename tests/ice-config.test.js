const IceService = require('../src/services/ice');

describe('ICE Service with Prompts Config', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = process.env;
    process.env.ICE_API_KEY = 'test-key';
    process.env.ICE_BASE_URL = 'https://test-api.com';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('should initialize with prompts config', () => {
    const iceService = new IceService();
    
    expect(iceService.prompts).toBeDefined();
    expect(iceService.prompts.hotSellingProducts).toBeDefined();
    expect(iceService.prompts.productViability).toBeDefined();
  });

  test('should have access to prompt templates', () => {
    const iceService = new IceService();
    
    expect(typeof iceService.prompts.hotSellingProducts).toBe('string');
    expect(typeof iceService.prompts.productViability).toBe('string');
    expect(iceService.prompts.productViability).toContain('{productList}');
  });
});