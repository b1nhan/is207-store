import { api } from './api';

const shippingProfileService = {
  getProfiles: () => api.get('/auth/shipping-profiles'),

  createProfile: (data) => api.post('/auth/shipping-profiles', data),

  setDefault: (id, userId) => api.patch(`/auth/shipping-profiles/${id}/default`, { profile_id: id, user_id: userId }),

  updateProfile: (id, data) => api.put(`/auth/shipping-profiles/${id}`, data),

  deleteProfile: (id) => api.delete(`/auth/shipping-profiles/${id}`),
};

export default shippingProfileService;
