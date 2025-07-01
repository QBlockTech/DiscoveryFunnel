# DiscoveryFunnel

An Express.js server application that integrates with external ICE service and Neon SQL database to discover and vet hot-selling 3D printable products.

## Overview

DiscoveryFunnel helps identify viable 3D printing products by:
1. Fetching hot-selling product trends using the ICE AI service
2. Retrieving scraped product data from a Neon SQL database
3. Vetting product viability through AI analysis
4. Cross-referencing results to recommend the best 3D printable products

## Features

- **API Key Authentication**: Secure all endpoints with API key validation
- **ICE Service Integration**: AI-powered market trend analysis and product vetting
- **Neon Database Integration**: Efficient product data retrieval
- **Health Monitoring**: Service status and connection health checks
- **Comprehensive Error Handling**: Robust error responses and logging
- **Testing Suite**: Unit tests for all major components

## Installation

1. Clone the repository:
```bash
git clone https://github.com/QBlockTech/DiscoveryFunnel.git
cd DiscoveryFunnel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your actual values
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# API Authentication
API_KEY=your-secure-api-key-here

# ICE Service Configuration
ICE_API_KEY=your-ice-service-api-key
ICE_BASE_URL=https://api.ice-service.com

# Neon Database Configuration
NEON_DATABASE_URL=postgresql://username:password@hostname:port/database
```

## API Endpoints

### Health Check

#### GET /health
Check server health status (no authentication required).

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0"
}
```

### Discovery API

All discovery endpoints require authentication via `x-api-key` header.

#### POST /api/discovery/workflow
Trigger the complete product discovery workflow.

**Headers:**
```
x-api-key: your-api-key
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "summary": {
    "hotCategories": 10,
    "totalProducts": 150,
    "vettedProducts": 150,
    "finalRecommendations": 20
  },
  "hotSellingCategories": [
    {
      "category": "3D Printing Tools",
      "demand_score": 8,
      "reason": "High demand for custom tools"
    }
  ],
  "recommendations": [
    {
      "id": 1,
      "name": "Custom Phone Case",
      "description": "Personalized phone protection",
      "price": 15.99,
      "category": "accessories",
      "ranking": 1,
      "compositeScore": 8.5,
      "viability": {
        "demand_score": 9,
        "feasibility_score": 8,
        "competition_score": 6,
        "profit_score": 8,
        "overall_score": 8,
        "recommendation": "Highly recommended"
      }
    }
  ]
}
```

#### GET /api/discovery/products/:category
Get products from a specific category.

**Headers:**
```
x-api-key: your-api-key
```

**Parameters:**
- `category` (string): Product category to filter by

**Response:**
```json
{
  "success": true,
  "category": "accessories",
  "count": 25,
  "products": [
    {
      "id": 1,
      "name": "Custom Phone Case",
      "description": "Personalized phone protection",
      "price": 15.99,
      "category": "accessories",
      "source_url": "https://example.com/product/1",
      "scraped_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/discovery/status
Check the status of all connected services.

**Headers:**
```
x-api-key: your-api-key
```

**Response:**
```json
{
  "success": true,
  "services": {
    "database": true,
    "ice": true
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database Schema

The application expects a `products` table in your Neon database with the following structure:

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category VARCHAR(100),
  source_url TEXT,
  scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Development

```bash
# Start development server with auto-reload
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Common HTTP status codes:
- `200`: Success
- `401`: Authentication required
- `403`: Invalid API key
- `404`: Resource not found
- `500`: Internal server error
- `503`: Service unavailable

## Authentication

All API endpoints (except `/health`) require authentication using an API key. Include the API key in one of the following headers:

- `x-api-key: your-api-key`
- `Authorization: your-api-key`
- `Authorization: Bearer your-api-key`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.