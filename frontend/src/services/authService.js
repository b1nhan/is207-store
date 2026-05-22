import { api } from './api';
import { API_ENDPOINTS } from '@/constants/api';

export const authService = {
    login: async (email, password) => {
        return api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    },

    register: async ({ email, password, username, full_name, phone }) => {
        return api.post(API_ENDPOINTS.AUTH.REGISTER, {
            email,
            password,
            username,
            ...(full_name && { full_name }),
            ...(phone && { phone }),
        });
    },

    getMe: async () => {
        return api.get(API_ENDPOINTS.AUTH.ME);
    },

    updateProfile: async ({ full_name, phone }) => {
        return api.patch(API_ENDPOINTS.AUTH.UPDATE_PROFILE, { full_name, phone });
    },

    logout: async () => {
        return api.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
};