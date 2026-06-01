import { getDB } from '../../database/connection.js';
import { toMySQLDatetime } from '../../utils/dateFormat.js'

class AdminCampaignRepository {
  async findAll({ limit, offset, status, campaign_type, search }) {
    const db = getDB();
    let query = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM campaign_products cp WHERE cp.campaign_id = c.campaign_id) as product_count
      FROM campaigns c
      WHERE 1=1
    `;
    const params = [];

    if (status !== undefined) {
      query += ` AND c.status = ?`;
      params.push(status);
    }
    if (campaign_type) {
      query += ` AND c.campaign_type = ?`;
      params.push(campaign_type);
    }
    if (search) {
      query += ` AND c.name LIKE ?`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await db.query(query, params);

    let countQuery = `SELECT COUNT(*) as total FROM campaigns c WHERE 1=1`;
    const countParams = [];
    if (status !== undefined) {
      countQuery += ` AND c.status = ?`;
      countParams.push(status);
    }
    if (campaign_type) {
      countQuery += ` AND c.campaign_type = ?`;
      countParams.push(campaign_type);
    }
    if (search) {
      countQuery += ` AND c.name LIKE ?`;
      countParams.push(`%${search}%`);
    }

    const [countRows] = await db.query(countQuery, countParams);

    return { rows, total: countRows[0].total };
  }

  async findById(campaignId) {
    const db = getDB();
    const [rows] = await db.query(`
      SELECT c.*, cc.discount_value as config_discount_value
      FROM campaigns c
      LEFT JOIN campaign_config cc ON c.campaign_id = cc.campaign_id
      WHERE c.campaign_id = ?
    `, [campaignId]);

    if (rows.length === 0) return null;
    const c = rows[0];

    const [products] = await db.query(`
      SELECT cp.product_id, p.product_name, p.slug, p.base_price
      FROM campaign_products cp
      JOIN products p ON cp.product_id = p.product_id
      WHERE cp.campaign_id = ?
    `, [campaignId]);

    const [tiers] = await db.query(`
      SELECT tier_id, min_order_value, discount_value
      FROM campaign_tiers
      WHERE campaign_id = ?
    `, [campaignId]);

    return {
      campaign_id: c.campaign_id,
      name: c.name,
      description: c.description,
      campaign_type: c.campaign_type,
      start_date: c.start_date,
      end_date: c.end_date,
      status: c.status,
      created_by: c.created_by,
      created_at: c.created_at,
      updated_at: c.updated_at,
      config: (c.campaign_type === 'PERCENTAGE' || c.campaign_type === 'FIXED_PRICE')
        ? { discount_value: Number(c.config_discount_value) }
        : null,
      tiers: c.campaign_type === 'TIER_DISCOUNT'
        ? tiers.map(t => ({ ...t, min_order_value: Number(t.min_order_value), discount_value: Number(t.discount_value) }))
        : [],
      products: products.map(p => ({ ...p, base_price: Number(p.base_price) }))
    };
  }

  async create(data, createdBy, conn) {
    const { name, description, campaign_type, start_date, end_date, status, config, tiers, product_ids } = data;

    const [result] = await conn.query(`
      INSERT INTO campaigns (name, description, campaign_type, start_date, end_date, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, description, campaign_type, toMySQLDatetime(start_date), toMySQLDatetime(end_date), status, createdBy]);

    const campaignId = result.insertId;

    if (config && (campaign_type === 'PERCENTAGE' || campaign_type === 'FIXED_PRICE')) {
      await conn.query(`
        INSERT INTO campaign_config (campaign_id, discount_value) VALUES (?, ?)
      `, [campaignId, config.discount_value]);
    }

    if (tiers && tiers.length > 0 && campaign_type === 'TIER_DISCOUNT') {
      const tierValues = tiers.map(t => [campaignId, t.min_order_value, t.discount_value]);
      await conn.query(`
        INSERT INTO campaign_tiers (campaign_id, min_order_value, discount_value) VALUES ?
      `, [tierValues]);
    }

    if (product_ids && product_ids.length > 0) {
      const productValues = product_ids.map(pid => [campaignId, pid]);
      await conn.query(`
        INSERT INTO campaign_products (campaign_id, product_id) VALUES ?
      `, [productValues]);
    }

    return campaignId;
  }

  async update(campaignId, data, conn) {
    const { name, description, start_date, end_date, config, tiers, product_ids } = data;

    const updateFields = [];
    const params = [];

    if (name !== undefined) { updateFields.push('name = ?'); params.push(name); }
    if (description !== undefined) { updateFields.push('description = ?'); params.push(description); }
    if (start_date !== undefined) { updateFields.push('start_date = ?'); params.push(toMySQLDatetime(start_date)); }
    if (end_date !== undefined) { updateFields.push('end_date = ?'); params.push(toMySQLDatetime(end_date)); }

    if (updateFields.length > 0) {
      params.push(campaignId);
      await conn.query(`UPDATE campaigns SET ${updateFields.join(', ')} WHERE campaign_id = ?`, params);
    }

    if (config !== undefined) {
      await conn.query(`DELETE FROM campaign_config WHERE campaign_id = ?`, [campaignId]);
      if (config) {
        await conn.query(`INSERT INTO campaign_config (campaign_id, discount_value) VALUES (?, ?)`, [campaignId, config.discount_value]);
      }
    }

    if (tiers !== undefined) {
      await conn.query(`DELETE FROM campaign_tiers WHERE campaign_id = ?`, [campaignId]);
      if (tiers && tiers.length > 0) {
        const tierValues = tiers.map(t => [campaignId, t.min_order_value, t.discount_value]);
        await conn.query(`INSERT INTO campaign_tiers (campaign_id, min_order_value, discount_value) VALUES ?`, [tierValues]);
      }
    }

    if (product_ids !== undefined) {
      await conn.query(`DELETE FROM campaign_products WHERE campaign_id = ?`, [campaignId]);
      if (product_ids && product_ids.length > 0) {
        const productValues = product_ids.map(pid => [campaignId, pid]);
        await conn.query(`INSERT INTO campaign_products (campaign_id, product_id) VALUES ?`, [productValues]);
      }
    }
  }

  async updateStatus(campaignId, status) {
    const db = getDB();
    await db.query(`UPDATE campaigns SET status = ? WHERE campaign_id = ?`, [status, campaignId]);
  }

  async delete(campaignId) {
    const db = getDB();
    await db.query(`DELETE FROM campaigns WHERE campaign_id = ?`, [campaignId]);
  }
}

export default new AdminCampaignRepository();
