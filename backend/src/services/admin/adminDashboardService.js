import adminDashboardRepository from '../../repositories/admin/adminDashboardRepository.js';

class AdminDashboardService {
  /**
   * Get dashboard summary
   */
  async getSummary() {
    return await adminDashboardRepository.getSummary();
  }

  /**
   * Get revenue chart data
   * @param {object} query 
   */
  async getRevenue(query) {
    const { from, to, groupBy } = query;
    return await adminDashboardRepository.getRevenue({ from, to, groupBy });
  }

  /**
   * Get top products chart data
   * @param {object} query 
   */
  async getTopProducts(query) {
    const { limit, from, to } = query;
    return await adminDashboardRepository.getTopProducts({ 
      limit: limit ? parseInt(limit, 10) : 10, 
      from, 
      to 
    });
  }
}

export default new AdminDashboardService();
