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

Return the response as a JSON array of objects with 'product_name', 'demand_score', 'feasibility_score', 'competition_score', 'profit_score', 'overall_score', and 'recommendation' fields.`,

  /**
   * Prompt for Etsy product trends analysis and tracking
   */
  etsyTrendsAssistant: `Act as my Etsy product trends assistant. 

I want you to create a fully structured Etsy Trends Tracker using only **data-driven category and product selection.** 

### Instructions: 

1. **Identify the top 4 Etsy product niches** based on the most recent Etsy Gross Merchandise Sales (GMS) or category sales rankings available. The niches must reflect the highest sales volume categories on Etsy right now based on current marketplace data. 

 

2. For each of the top 4 niches: 

- Provide the **top 3–4 currently trending products.** 

 

3. For each product, include: 

- Product Name 

- Average Price (USD) 

- Estimated Monthly Sales 

- Number of Favorites (if available) 

- Direct Etsy Product Link (must be active and working) 

- Sample Picture (must be a current working image link) 

 

4. Also, provide a list of **upcoming relevant holidays and events** for the next 2 months that are known to impact Etsy product demand. The holidays must be selected based on global and regional consumer seasonality calendars that typically affect Etsy shopping trends. 

 

5. Include a section for **Top Seasonal Products for the Current and Upcoming Quarter.** For each seasonal product, provide: 

- Product Name 

- Average Price (USD) 

- Estimated Monthly Sales 

- Seasonality Notes (specify when this product historically peaks based on 3–5 years of Google Trends data) 

- Direct Etsy Product Link (must be active and working) 

- Sample Picture (must be a current working image link) 

 

6. All data must be sourced from: 

- **Current Etsy GMS category sales rankings** and Etsy marketplace performance data 

- **Current Etsy search results** (active listings only) 

- **Google Trends** (for seasonality and multi-year sales patterns) 

- **EtsyHunt, Alura, or similar trend tracking platforms** (if available) 

 

7. Format all results in **clean Markdown tables, exactly matching the structure of the Etsy Trends Tracker.** 

 

8. Summarize **key trends and observations** at the end. 

 

9. Prioritize fresh, live, and accurate data. Do not include outdated, inactive, or sold-out listings. 

 

### Summary: 

This tracker must be fully data-driven, with no manual category or product selection. All decisions should come directly from Etsy sales trends, consumer seasonality, and real-time product activity.`
};

module.exports = prompts;