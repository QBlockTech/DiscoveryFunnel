const express = require('express');
const DiscoveryService = require('../services/discovery');
const router = express.Router();

/**
 * Trigger the complete product discovery workflow
 * POST /api/discovery/workflow
 */
router.post('/workflow', async (req, res) => {
  try {
    const discoveryService = new DiscoveryService();
    const results = await discoveryService.executeDiscoveryWorkflow();
    
    res.json(results);
  } catch (error) {
    console.error('Discovery workflow error:', error);
    res.status(500).json({
      success: false,
      error: 'Discovery Workflow Failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get products by category
 * GET /api/discovery/products/:category
 */
router.get('/products/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const discoveryService = new DiscoveryService();
    const products = await discoveryService.getProductsByCategory(category);
    
    res.json({
      success: true,
      category,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to Fetch Products',
      message: error.message
    });
  }
});

/**
 * Test service connections
 * GET /api/discovery/status
 */
router.get('/status', async (req, res) => {
  try {
    const discoveryService = new DiscoveryService();
    const connections = await discoveryService.testConnections();
    
    const allConnected = Object.values(connections).every(status => status === true);
    
    res.status(allConnected ? 200 : 503).json({
      success: allConnected,
      services: connections,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Service status check error:', error);
    res.status(500).json({
      success: false,
      error: 'Status Check Failed',
      message: error.message
    });
  }
});

module.exports = router;