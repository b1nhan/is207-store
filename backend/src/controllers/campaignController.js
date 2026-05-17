import campaignService from '../services/campaignService.js';
import { sendSuccess } from '../utils/response.js';

class CampaignController {
  getActiveCampaigns = async (req, res, next) => {
    try {
      const result = await campaignService.getActiveCampaigns(req.query);
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  };
}

export default new CampaignController();
