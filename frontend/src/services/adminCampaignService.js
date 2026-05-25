import axios from '@/config/axios';

const adminCampaignService = {
  getAllCampaigns: (params) => {
    return axios.get('/admin/campaigns', { params });
  },
  getCampaignById: (id) => {
    return axios.get(`/admin/campaigns/${id}`);
  },
  createCampaign: (data) => {
    return axios.post('/admin/campaigns', data);
  },
  updateCampaign: (id, data) => {
    return axios.put(`/admin/campaigns/${id}`, data);
  },
  updateStatus: (id, status) => {
    return axios.patch(`/admin/campaigns/${id}/status`, { status });
  },
  deleteCampaign: (id) => {
    return axios.delete(`/admin/campaigns/${id}`);
  },
};

export default adminCampaignService;
