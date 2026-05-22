import adminCampaignService from '../../services/admin/adminCampaignService.js';
import { sendSuccess } from '../../utils/response.js';

class AdminCampaignController {
  getAllCampaigns = async (req, res, next) => {
    try {
      const result = await adminCampaignService.getAllCampaigns(req.query);
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  };

  getCampaignById = async (req, res, next) => {
    try {
      const result = await adminCampaignService.getCampaignById(req.params.id);
      sendSuccess(res, { data: result });
    } catch (error) {
      next(error);
    }
  };

  createCampaign = async (req, res, next) => {
    try {
      const result = await adminCampaignService.createCampaign(req.body, req.user.user_id);
      sendSuccess(res, { data: result, message: 'Tạo campaign thành công', status: 201 });
    } catch (error) {
      next(error);
    }
  };

  updateCampaign = async (req, res, next) => {
    try {
      const result = await adminCampaignService.updateCampaign(req.params.id, req.body);
      sendSuccess(res, { data: result, message: 'Cập nhật campaign thành công' });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const result = await adminCampaignService.updateStatus(req.params.id, req.body.status);
      sendSuccess(res, { data: result, message: 'Cập nhật trạng thái campaign thành công' });
    } catch (error) {
      next(error);
    }
  };

  deleteCampaign = async (req, res, next) => {
    try {
      await adminCampaignService.deleteCampaign(req.params.id);
      sendSuccess(res, { message: 'Xóa campaign thành công' });
    } catch (error) {
      next(error);
    }
  };
}

export default new AdminCampaignController();
