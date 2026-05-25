import { api } from './api';

const shippingProfileService = {
  getProfiles: () => api.get('/auth/shipping-profiles'),

  createProfile: (data) => api.post('/auth/shipping-profiles', data),

  setDefault: (id) => api.patch(`/auth/shipping-profiles/${id}/default`, {}),

  updateProfile: (id, data) => api.put(`/auth/shipping-profiles/${id}`, data),

  deleteProfile: (id) => api.delete(`/auth/shipping-profiles/${id}`),
};

export default shippingProfileService;
