import { getDB } from '../../database/connection.js';
import adminCampaignRepository from '../../repositories/admin/adminCampaignRepository.js';
import AppError from '../../utils/AppError.js';
import { ERROR_CODES } from '../../constants/errorCode.js';
import { getPagination, getPaginationData } from '../../utils/pagination.js';

class AdminCampaignService {
  async getAllCampaigns(query) {
    const { page = 1, limit = 20, status, campaign_type, search } = query;
    const { limit: lim, offset, currentPage } = getPagination(page, limit);

    const { rows, total } = await adminCampaignRepository.findAll({
      limit: lim,
      offset,
      status: status !== undefined ? Number(status) : undefined,
      campaign_type,
      search,
    });

    return {
      items: rows,
      pagination: getPaginationData(total, currentPage, lim),
    };
  }

  async getCampaignById(id) {
    const campaign = await adminCampaignRepository.findById(id);
    if (!campaign) {
      throw new AppError('Không tìm thấy campaign', 404, ERROR_CODES.CAMPAIGN.NOT_FOUND);
    }
    return campaign;
  }

  async createCampaign(data, userId) {
    const { campaign_type, config, tiers, product_ids, start_date, end_date } = data;

    if ((campaign_type === 'PERCENTAGE' || campaign_type === 'FIXED_PRICE') && (!config || config.discount_value === undefined)) {
      throw new AppError('Thiếu config', 400, ERROR_CODES.CAMPAIGN.CONFIG_REQUIRED);
    }
    if (campaign_type === 'TIER_DISCOUNT' && (!tiers || tiers.length === 0)) {
      throw new AppError('Thiếu tiers', 400, ERROR_CODES.CAMPAIGN.TIERS_REQUIRED);
    }
    if ((campaign_type === 'PERCENTAGE' || campaign_type === 'FIXED_PRICE' || campaign_type === 'FREESHIP') && (!product_ids || product_ids.length === 0)) {
      throw new AppError('Thiếu product_ids', 400, ERROR_CODES.CAMPAIGN.PRODUCTS_REQUIRED);
    }

    if (campaign_type === 'TIER_DISCOUNT' && tiers) {
      const minOrderValues = tiers.map(t => t.min_order_value);
      if (new Set(minOrderValues).size !== minOrderValues.length) {
        throw new AppError('Trùng min_order_value trong tiers', 400, ERROR_CODES.CAMPAIGN.TIERS_DUPLICATE);
      }
    }

    const db = getDB();
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const campaignId = await adminCampaignRepository.create(data, userId, conn);

      await conn.commit();
      return { campaign_id: campaignId, name: data.name, campaign_type };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async updateCampaign(id, data) {
    const campaign = await adminCampaignRepository.findById(id);
    if (!campaign) {
      throw new AppError('Không tìm thấy campaign', 404, ERROR_CODES.CAMPAIGN.NOT_FOUND);
    }

    const now = new Date();
    const startDate = new Date(campaign.start_date);
    if (campaign.status === 1 && startDate <= now) {
      throw new AppError('Không thể chỉnh sửa campaign đang active', 422, ERROR_CODES.CAMPAIGN.ALREADY_ACTIVE);
    }

    const { config, tiers, product_ids } = data;
    const campaign_type = campaign.campaign_type;

    if (config !== undefined && (campaign_type === 'PERCENTAGE' || campaign_type === 'FIXED_PRICE') && (!config || config.discount_value === undefined)) {
        throw new AppError('Thiếu config', 400, ERROR_CODES.CAMPAIGN.CONFIG_REQUIRED);
    }
    if (tiers !== undefined && campaign_type === 'TIER_DISCOUNT' && (!tiers || tiers.length === 0)) {
        throw new AppError('Thiếu tiers', 400, ERROR_CODES.CAMPAIGN.TIERS_REQUIRED);
    }
    if (product_ids !== undefined && (campaign_type === 'PERCENTAGE' || campaign_type === 'FIXED_PRICE' || campaign_type === 'FREESHIP') && (!product_ids || product_ids.length === 0)) {
        throw new AppError('Thiếu product_ids', 400, ERROR_CODES.CAMPAIGN.PRODUCTS_REQUIRED);
    }

    const db = getDB();
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      await adminCampaignRepository.update(id, data, conn);

      await conn.commit();
      return { campaign_id: Number(id) };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  async updateStatus(id, status) {
    const campaign = await adminCampaignRepository.findById(id);
    if (!campaign) {
      throw new AppError('Không tìm thấy campaign', 404, ERROR_CODES.CAMPAIGN.NOT_FOUND);
    }

    await adminCampaignRepository.updateStatus(id, status);
    return { campaign_id: Number(id), status };
  }

  async deleteCampaign(id) {
    const campaign = await adminCampaignRepository.findById(id);
    if (!campaign) {
      throw new AppError('Không tìm thấy campaign', 404, ERROR_CODES.CAMPAIGN.NOT_FOUND);
    }

    const now = new Date();
    const startDate = new Date(campaign.start_date);

    if (startDate <= now) {
      throw new AppError('Không thể xóa campaign đã active hoặc đã kết thúc', 422, ERROR_CODES.CAMPAIGN.CANNOT_DELETE);
    }

    await adminCampaignRepository.delete(id);
  }
}

export default new AdminCampaignService();
