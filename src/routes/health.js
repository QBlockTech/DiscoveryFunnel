const express = require('express');
const router = express.Router();

/**
 * Health check endpoint
 * GET /health
 */
router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

module.exports = router;