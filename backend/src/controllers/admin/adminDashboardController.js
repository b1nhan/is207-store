import adminDashboardService from '../../services/admin/adminDashboardService.js';
import { sendSuccess } from '../../utils/response.js';

class AdminDashboardController {
  getSummary = async (req, res, next) => {
    try {
      const summary = await adminDashboardService.getSummary();
      sendSuccess(res, { data: summary });
    } catch (error) {
      next(error);
    }
  };

  getRevenue = async (req, res, next) => {
    try {
      const revenue = await adminDashboardService.getRevenue(req.query);
      sendSuccess(res, { data: revenue });
    } catch (error) {
      next(error);
    }
  };

  getTopProducts = async (req, res, next) => {
    try {
      const topProducts = await adminDashboardService.getTopProducts(req.query);
      sendSuccess(res, { data: topProducts });
    } catch (error) {
      next(error);
    }
  };
}

export default new AdminDashboardController();
