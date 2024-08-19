import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/v1/auth' : '/api/v1/auth';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, name });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null });
        } catch (error) {
            set({ error: error.response.data.message || 'Error in signing up', isLoading: false });
            throw error;
        }
        set({ isLoading: false });
    },

    signin: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signin`, { email, password });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null });
        } catch (error) {
            set({ error: error.response.data.message || 'Error in signing in', isLoading: false });
            throw error;
        }
        set({ isLoading: false });
    },

    signout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post(`${API_URL}/signout`);
            set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        } catch (error) {
            set({ error: 'Error in signing out', isLoading: false });
            throw error;
        }
        set({ isLoading: false });
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || 'Error verifying email', isLoading: false });
            throw error;
        }
    },
}));
