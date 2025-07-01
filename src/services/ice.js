class IceService {
  constructor() {
    this.apiKey = process.env.ICE_API_KEY;
    this.baseUrl = process.env.ICE_BASE_URL;

    if (!this.apiKey) {
      throw new Error('ICE_API_KEY environment variable is required');
    }
    if (!this.baseUrl) {
      throw new Error('ICE_BASE_URL environment variable is required');
    }
  }

  /**
   * Make a request to the ICE service
   * @param {string} model - AI model to use
   * @param {string} prompt - Prompt to send to the model
   * @returns {Promise<Object>} Response from ICE service
   */
  async makeRequest(model, prompt) {
    try {
      const response = await globalThis.fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          model,
          prompt
        })
      });

      if (!response.ok) {
        throw new Error(`ICE service request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('ICE service request error:', error);
      throw new Error(`Failed to communicate with ICE service: ${error.message}`);
    }
  }

  /**
   * Get hot selling products using ICE service
   * @returns {Promise<Array>} Array of hot selling product categories/types
   */
  async getHotSellingProducts() {
    const prompt = `Analyze current market trends and identify the top 10 hot selling product categories for 3D printing in 2024. 
    Focus on consumer products that are:
    1. In high demand
    2. Suitable for 3D printing
    3. Have commercial viability
    4. Popular in online marketplaces
    
    Return the response as a JSON array of objects with 'category', 'demand_score' (1-10), and 'reason' fields.`;

    try {
      const response = await this.makeRequest('gpt-4', prompt);
      return this.parseHotProductsResponse(response);
    } catch (error) {
      console.error('Error getting hot selling products:', error);
      throw error;
    }
  }

  /**
   * Vet product viability using ICE service
   * @param {Array} products - Array of products to vet
   * @returns {Promise<Array>} Array of vetted products with viability scores
   */
  async vetProductViability(products) {
    const productList = products.map(p => `${p.name}: ${p.description} (Price: $${p.price})`).join('\n');
    
    const prompt = `Analyze the following 3D printable products for market viability and commercial potential:

${productList}

For each product, evaluate:
1. Market demand potential (1-10)
2. 3D printing feasibility (1-10)
3. Competition level (1-10, where 10 is highly competitive)
4. Profit margin potential (1-10)
5. Overall viability score (1-10)

Return the response as a JSON array of objects with 'product_name', 'demand_score', 'feasibility_score', 'competition_score', 'profit_score', 'overall_score', and 'recommendation' fields.`;

    try {
      const response = await this.makeRequest('gpt-4', prompt);
      return this.parseViabilityResponse(response, products);
    } catch (error) {
      console.error('Error vetting product viability:', error);
      throw error;
    }
  }

  /**
   * Parse hot products response from ICE service
   * @param {Object} response - Raw response from ICE service
   * @returns {Array} Parsed array of hot products
   */
  parseHotProductsResponse(response) {
    try {
      // Try to extract JSON from the response
      let jsonString = response.content || response.text || response.message || '';
      
      // Look for JSON array pattern
      const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: return a default structure
      console.warn('Could not parse ICE response for hot products, using fallback');
      return [
        { category: '3D Printing Tools', demand_score: 8, reason: 'High demand for custom tools' },
        { category: 'Home Decor', demand_score: 7, reason: 'Popular personalized items' },
        { category: 'Toys & Games', demand_score: 9, reason: 'Educational and entertainment value' }
      ];
    } catch (error) {
      console.error('Error parsing hot products response:', error);
      throw new Error('Failed to parse ICE service response for hot products');
    }
  }

  /**
   * Parse viability response from ICE service
   * @param {Object} response - Raw response from ICE service
   * @param {Array} originalProducts - Original products array
   * @returns {Array} Parsed array of vetted products
   */
  parseViabilityResponse(response, originalProducts) {
    try {
      let jsonString = response.content || response.text || response.message || '';
      
      // Look for JSON array pattern
      const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Merge with original product data
        return originalProducts.map((product, index) => ({
          ...product,
          viability: parsed[index] || {
            demand_score: 5,
            feasibility_score: 5,
            competition_score: 5,
            profit_score: 5,
            overall_score: 5,
            recommendation: 'Requires further analysis'
          }
        }));
      }
      
      // Fallback: return products with default scores
      console.warn('Could not parse ICE response for viability, using fallback scores');
      return originalProducts.map(product => ({
        ...product,
        viability: {
          demand_score: 5,
          feasibility_score: 5,
          competition_score: 5,
          profit_score: 5,
          overall_score: 5,
          recommendation: 'Requires manual analysis'
        }
      }));
    } catch (error) {
      console.error('Error parsing viability response:', error);
      throw new Error('Failed to parse ICE service response for product viability');
    }
  }
}

module.exports = IceService;