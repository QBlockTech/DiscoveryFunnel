/**
 * Authentication middleware to validate API key
 */
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    return res.status(500).json({
      error: 'Configuration Error',
      message: 'Server API key not configured'
    });
  }

  if (!apiKey) {
    return res.status(401).json({
      error: 'Authentication Required',
      message: 'API key is required. Include it in x-api-key header'
    });
  }

  // Remove 'Bearer ' prefix if present
  const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '');

  if (cleanApiKey !== expectedApiKey) {
    return res.status(403).json({
      error: 'Authentication Failed',
      message: 'Invalid API key'
    });
  }

  next();
};

module.exports = authMiddleware;