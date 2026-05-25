import campaignRepository from '../repositories/campaignRepository.js';

class CampaignService {
  async getActiveCampaigns(query) {
    const { campaign_type, product_id } = query;
    return await campaignRepository.findActiveCampaigns({ 
      campaign_type, 
      product_id: product_id ? Number(product_id) : undefined 
    });
  }

  async getCampaignById(id) {
    return await campaignRepository.findById(Number(id));
  }

  async getDiscountedProducts(limit) {
    return await campaignRepository.findDiscountedProducts(limit);
  }
}

export default new CampaignService();
