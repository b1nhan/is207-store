import campaignService from '../services/campaignService.js';
import { sendSuccess, sendError } from '../utils/response.js';

class CampaignController {
  getActiveCampaigns = async (req, res, next) => {
    try {
      const result = await campaignService.getActiveCampaigns(req.query);
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  };

  getCampaignById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await campaignService.getCampaignById(id);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Campaign not found or not active' });
      }
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  };

  getDiscountedProducts = async (req, res, next) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 16;
      const result = await campaignService.getDiscountedProducts(limit);
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  };
}

export default new CampaignController();
