import { api } from './api';
import { API_ENDPOINTS } from '@/constants/api';

// ─── Campaign Service (Shop / Public) ─────────────────────────────────────────

export const campaignService = {
  // Lấy tất cả campaign đang active
  getActiveCampaigns: (params = {}) =>
    api.get(API_ENDPOINTS.CAMPAIGNS.ACTIVE, params),

  // Lấy chi tiết 1 campaign theo id (phải còn active)
  getCampaignById: (id) =>
    api.get(API_ENDPOINTS.CAMPAIGNS.DETAIL(id)),

  // Lấy tất cả sản phẩm đang được giảm giá từ campaign (kèm discount)
  getDiscountedProducts: (limit = 16) =>
    api.get(API_ENDPOINTS.CAMPAIGNS.DISCOUNTED_PRODUCTS, { limit }),
};
