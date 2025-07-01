const { neon } = require('@neondatabase/serverless');

class DatabaseService {
  constructor() {
    if (!process.env.NEON_DATABASE_URL) {
      throw new Error('NEON_DATABASE_URL environment variable is required');
    }
    this.sql = neon(process.env.NEON_DATABASE_URL);
  }

  /**
   * Get all products from the products table
   * @returns {Promise<Array>} Array of products
   */
  async getProducts() {
    try {
      const products = await this.sql`
        SELECT id, name, description, price, category, source_url, scraped_at
        FROM products
        ORDER BY scraped_at DESC
      `;
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products from database');
    }
  }

  /**
   * Get products by category
   * @param {string} category - Product category
   * @returns {Promise<Array>} Array of products in the specified category
   */
  async getProductsByCategory(category) {
    try {
      const products = await this.sql`
        SELECT id, name, description, price, category, source_url, scraped_at
        FROM products
        WHERE category = ${category}
        ORDER BY scraped_at DESC
      `;
      return products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error(`Failed to fetch products for category: ${category}`);
    }
  }

  /**
   * Get a specific product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object|null>} Product object or null if not found
   */
  async getProductById(id) {
    try {
      const products = await this.sql`
        SELECT id, name, description, price, category, source_url, scraped_at
        FROM products
        WHERE id = ${id}
      `;
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error(`Failed to fetch product with ID: ${id}`);
    }
  }

  /**
   * Test database connection
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      await this.sql`SELECT 1 as test`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}

module.exports = DatabaseService;