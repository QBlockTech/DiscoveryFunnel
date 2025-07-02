const prompts = require('../config/prompts');

describe('Prompts Configuration', () => {
  test('should load prompts config successfully', () => {
    expect(prompts).toBeDefined();
    expect(typeof prompts).toBe('object');
  });

  test('should contain hotSellingProducts prompt', () => {
    expect(prompts.hotSellingProducts).toBeDefined();
    expect(typeof prompts.hotSellingProducts).toBe('string');
    expect(prompts.hotSellingProducts.length).toBeGreaterThan(0);
    expect(prompts.hotSellingProducts).toContain('JSON array');
  });

  test('should contain productViability prompt template', () => {
    expect(prompts.productViability).toBeDefined();
    expect(typeof prompts.productViability).toBe('string');
    expect(prompts.productViability.length).toBeGreaterThan(0);
    expect(prompts.productViability).toContain('{productList}');
    expect(prompts.productViability).toContain('JSON array');
  });

  test('productViability prompt should be replaceable', () => {
    const testProductList = 'Test Product: Description (Price: $10)';
    const renderedPrompt = prompts.productViability.replace('{productList}', testProductList);
    
    expect(renderedPrompt).toContain(testProductList);
    expect(renderedPrompt).not.toContain('{productList}');
  });

  test('should contain etsyTrendsAssistant prompt', () => {
    expect(prompts.etsyTrendsAssistant).toBeDefined();
    expect(typeof prompts.etsyTrendsAssistant).toBe('string');
    expect(prompts.etsyTrendsAssistant.length).toBeGreaterThan(0);
    expect(prompts.etsyTrendsAssistant).toContain('Etsy product trends assistant');
    expect(prompts.etsyTrendsAssistant).toContain('top 4 Etsy product niches');
    expect(prompts.etsyTrendsAssistant).toContain('Gross Merchandise Sales');
    expect(prompts.etsyTrendsAssistant).toContain('Markdown tables');
  });
});