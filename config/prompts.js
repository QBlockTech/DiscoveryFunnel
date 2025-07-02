/**
 * Configuration file for AI prompts used by the ICE service
 * This file contains all prompts used for product analysis and market research
 */

const prompts = {
  /**
   * Prompt for identifying hot selling product categories for 3D printing
   */
  hotSellingProducts: `Analyze current market trends and identify the top 10 hot selling product categories for 3D printing in 2024. 
    Focus on consumer products that are:
    1. In high demand
    2. Suitable for 3D printing
    3. Have commercial viability
    4. Popular in online marketplaces
    
    Return the response as a JSON array of objects with 'category', 'demand_score' (1-10), and 'reason' fields.`,

  /**
   * Prompt template for analyzing product viability
   * Use {productList} placeholder which will be replaced with actual product data
   */
  productViability: `Analyze the following 3D printable products for market viability and commercial potential:

{productList}

For each product, evaluate:
1. Market demand potential (1-10)
2. 3D printing feasibility (1-10)
3. Competition level (1-10, where 10 is highly competitive)
4. Profit margin potential (1-10)
5. Overall viability score (1-10)

Return the response as a JSON array of objects with 'product_name', 'demand_score', 'feasibility_score', 'competition_score', 'profit_score', 'overall_score', and 'recommendation' fields.`
};

module.exports = prompts;