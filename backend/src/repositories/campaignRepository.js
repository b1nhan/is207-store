import { getDB } from '../database/connection.js';

class CampaignRepository {
  async findActiveCampaigns({ campaign_type, product_id } = {}) {
    const db = getDB();
    
    let query = `
      SELECT c.*,
             cc.discount_value as config_discount_value
      FROM campaigns c
      LEFT JOIN campaign_config cc ON c.campaign_id = cc.campaign_id
      WHERE c.status = 1 
        AND c.start_date <= NOW() 
        AND c.end_date >= NOW()
    `;
    
    const params = [];
    
    if (campaign_type) {
      query += ` AND c.campaign_type = ?`;
      params.push(campaign_type);
    }
    
    if (product_id) {
      // product_id is in campaign_products, or campaign_products is empty for TIER_DISCOUNT applying to all
      query += ` AND (
        EXISTS (SELECT 1 FROM campaign_products cp WHERE cp.campaign_id = c.campaign_id AND cp.product_id = ?)
        OR 
        (c.campaign_type = 'TIER_DISCOUNT' AND NOT EXISTS (SELECT 1 FROM campaign_products cp2 WHERE cp2.campaign_id = c.campaign_id))
      )`;
      params.push(product_id);
    }

    const [campaigns] = await db.query(query, params);
    
    if (campaigns.length === 0) return [];
    
    const campaignIds = campaigns.map(c => c.campaign_id);
    
    const [products] = await db.query(`
      SELECT cp.campaign_id, p.product_id, p.product_name, p.base_price
      FROM campaign_products cp
      JOIN products p ON cp.product_id = p.product_id
      WHERE cp.campaign_id IN (?)
    `, [campaignIds]);
    
    const [tiers] = await db.query(`
      SELECT * FROM campaign_tiers WHERE campaign_id IN (?)
    `, [campaignIds]);
    
    return campaigns.map(c => {
      const camp = {
        campaign_id: c.campaign_id,
        name: c.name,
        description: c.description,
        campaign_type: c.campaign_type,
        start_date: c.start_date,
        end_date: c.end_date,
        status: c.status,
      };
      
      if (c.campaign_type === 'PERCENTAGE' || c.campaign_type === 'FIXED_PRICE') {
        camp.config = { discount_value: Number(c.config_discount_value) };
      } else {
        camp.config = null;
      }
      
      if (c.campaign_type === 'TIER_DISCOUNT') {
        camp.tiers = tiers.filter(t => t.campaign_id === c.campaign_id).map(t => ({
          tier_id: t.tier_id,
          min_order_value: Number(t.min_order_value),
          discount_value: Number(t.discount_value)
        }));
      }
      
      camp.products = products.filter(p => p.campaign_id === c.campaign_id).map(p => ({
        product_id: p.product_id,
        product_name: p.product_name,
        base_price: Number(p.base_price)
      }));
      
      return camp;
    });
  }
}

export default new CampaignRepository();
