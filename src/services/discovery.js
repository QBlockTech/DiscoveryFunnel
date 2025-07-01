const DatabaseService = require('../utils/database');
const IceService = require('./ice');

class DiscoveryService {
  constructor() {
    this.db = new DatabaseService();
    this.ice = new IceService();
  }

  /**
   * Execute the complete product discovery workflow
   * @returns {Promise<Object>} Results of the discovery process
   */
  async executeDiscoveryWorkflow() {
    try {
      console.log('Starting product discovery workflow...');

      // Step 1: Get hot selling products from ICE service
      console.log('Step 1: Fetching hot selling products...');
      const hotProducts = await this.ice.getHotSellingProducts();

      // Step 2: Get products from database
      console.log('Step 2: Fetching products from database...');
      const dbProducts = await this.db.getProducts();

      if (dbProducts.length === 0) {
        throw new Error('No products found in database');
      }

      // Step 3: Vet product viability using ICE service
      console.log('Step 3: Vetting product viability...');
      const vettedProducts = await this.ice.vetProductViability(dbProducts);

      // Step 4: Cross-reference and filter products
      console.log('Step 4: Cross-referencing results...');
      const filteredProducts = this.crossReferenceProducts(hotProducts, vettedProducts);

      // Step 5: Rank and return final results
      const finalResults = this.rankProducts(filteredProducts);

      console.log('Product discovery workflow completed successfully');

      return {
        success: true,
        timestamp: new Date().toISOString(),
        summary: {
          hotCategories: hotProducts.length,
          totalProducts: dbProducts.length,
          vettedProducts: vettedProducts.length,
          finalRecommendations: finalResults.length
        },
        hotSellingCategories: hotProducts,
        recommendations: finalResults
      };

    } catch (error) {
      console.error('Discovery workflow error:', error);
      throw error;
    }
  }

  /**
   * Cross-reference hot selling categories with vetted products
   * @param {Array} hotProducts - Hot selling product categories
   * @param {Array} vettedProducts - Products with viability scores
   * @returns {Array} Filtered products that match hot categories
   */
  crossReferenceProducts(hotProducts, vettedProducts) {
    const hotCategories = hotProducts.map(hp => hp.category.toLowerCase());
    
    return vettedProducts.filter(product => {
      // Check if product category or name matches any hot category
      const productCategory = product.category?.toLowerCase() || '';
      const productName = product.name?.toLowerCase() || '';
      const productDescription = product.description?.toLowerCase() || '';
      
      return hotCategories.some(hotCategory => {
        const categoryWords = hotCategory.split(' ');
        return categoryWords.some(word => 
          productCategory.includes(word) || 
          productName.includes(word) || 
          productDescription.includes(word)
        );
      });
    });
  }

  /**
   * Rank products based on viability scores and hot category alignment
   * @param {Array} products - Filtered products
   * @returns {Array} Ranked products
   */
  rankProducts(products) {
    return products
      .map(product => {
        const viability = product.viability || {};
        
        // Calculate composite score
        const compositeScore = (
          (viability.demand_score || 0) * 0.3 +
          (viability.feasibility_score || 0) * 0.25 +
          (viability.profit_score || 0) * 0.25 +
          ((10 - (viability.competition_score || 5)) * 0.2) // Lower competition is better
        );

        return {
          ...product,
          compositeScore: Math.round(compositeScore * 100) / 100,
          ranking: null // Will be set after sorting
        };
      })
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .map((product, index) => ({
        ...product,
        ranking: index + 1
      }))
      .slice(0, 20); // Return top 20 recommendations
  }

  /**
   * Get products by category from database
   * @param {string} category - Product category
   * @returns {Promise<Array>} Products in the specified category
   */
  async getProductsByCategory(category) {
    return await this.db.getProductsByCategory(category);
  }

  /**
   * Test all service connections
   * @returns {Promise<Object>} Connection status for all services
   */
  async testConnections() {
    const results = {
      database: false,
      ice: false
    };

    try {
      results.database = await this.db.testConnection();
    } catch (error) {
      console.error('Database connection test failed:', error);
    }

    try {
      // Test ICE service with a simple request
      await this.ice.makeRequest('gpt-3.5-turbo', 'Test connection');
      results.ice = true;
    } catch (error) {
      console.error('ICE service connection test failed:', error);
    }

    return results;
  }
}

module.exports = DiscoveryService;