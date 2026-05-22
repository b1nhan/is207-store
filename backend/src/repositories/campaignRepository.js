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
      SELECT cp.campaign_id, p.product_id, p.product_name, p.base_price,
             pi.image_url as thumbnail
      FROM campaign_products cp
      JOIN products p ON cp.product_id = p.product_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
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
        base_price: Number(p.base_price),
        thumbnail: p.thumbnail || null
      }));
      
      return camp;
    });
  }

  async findById(campaignId) {
    const db = getDB();
    const [rows] = await db.query(`
      SELECT c.*, cc.discount_value as config_discount_value
      FROM campaigns c
      LEFT JOIN campaign_config cc ON c.campaign_id = cc.campaign_id
      WHERE c.campaign_id = ? AND c.status = 1
        AND c.start_date <= NOW() AND c.end_date >= NOW()
    `, [campaignId]);

    if (rows.length === 0) return null;
    const c = rows[0];

    const [products] = await db.query(`
      SELECT cp.product_id, p.product_name, p.base_price,
             pi.image_url as thumbnail
      FROM campaign_products cp
      JOIN products p ON cp.product_id = p.product_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = 1
      WHERE cp.campaign_id = ?
    `, [campaignId]);

    const [tiers] = await db.query(`
      SELECT tier_id, min_order_value, discount_value
      FROM campaign_tiers WHERE campaign_id = ?
    `, [campaignId]);

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
      camp.tiers = tiers.map(t => ({
        tier_id: t.tier_id,
        min_order_value: Number(t.min_order_value),
        discount_value: Number(t.discount_value)
      }));
    }

    camp.products = products.map(p => ({
      product_id: p.product_id,
      product_name: p.product_name,
      base_price: Number(p.base_price),
      thumbnail: p.thumbnail || null
    }));

    return camp;
  }

  /**
   * Lấy tất cả sản phẩm đang được giảm giá từ campaign PERCENTAGE / FIXED_PRICE.
   * Trả về mỗi sản phẩm kèm discount cao nhất (trong trường hợp có nhiều campaign).
   * @param {number} [limit=16]
   */
  async findDiscountedProducts(limit = 16) {
    const db = getDB();

    // Lấy tất cả (product, campaign) pairs từ các campaign đang active PERCENTAGE/FIXED_PRICE
    const [rows] = await db.query(`
      SELECT
        p.product_id,
        p.product_name,
        p.base_price,
        pi.image_url  AS thumbnail,
        c.campaign_id,
        c.campaign_type,
        c.end_date,
        cc.discount_value
      FROM campaign_products cp
      JOIN campaigns c
        ON cp.campaign_id = c.campaign_id
        AND c.status = 1
        AND c.start_date <= NOW()
        AND c.end_date   >= NOW()
        AND c.campaign_type IN ('PERCENTAGE', 'FIXED_PRICE')
      JOIN campaign_config cc ON cc.campaign_id = c.campaign_id
      JOIN products p ON cp.product_id = p.product_id AND p.status = 1
      LEFT JOIN product_images pi
        ON pi.product_id = p.product_id AND pi.is_primary = 1
      ORDER BY p.product_id, cc.discount_value DESC
    `);

    if (rows.length === 0) return [];

    // Deduplicate: per product keep the campaign with highest discount
    const map = new Map();
    for (const row of rows) {
      const pid = row.product_id;
      if (!map.has(pid)) {
        map.set(pid, row);
      } else {
        const existing = map.get(pid);
        // Compare "effective" discount amount
        const newAmt = row.campaign_type === 'PERCENTAGE'
          ? row.base_price * row.discount_value / 100
          : row.discount_value;
        const exAmt = existing.campaign_type === 'PERCENTAGE'
          ? existing.base_price * existing.discount_value / 100
          : existing.discount_value;
        if (newAmt > exAmt) map.set(pid, row);
      }
    }

    return Array.from(map.values())
      .slice(0, limit)
      .map(r => ({
        product_id: r.product_id,
        product_name: r.product_name,
        base_price: Number(r.base_price),
        thumbnail: r.thumbnail || null,
        campaign_id: r.campaign_id,
        discount: {
          type: r.campaign_type,        // 'PERCENTAGE' | 'FIXED_PRICE'
          value: Number(r.discount_value),
        },
        end_date: r.end_date,
      }));
  }
}

export default new CampaignRepository();
