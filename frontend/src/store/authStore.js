import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/v1/auth' : '/api/v1/auth';

axios.defaults.withCredentials = true;

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
            return response.data.user;
        } catch (error) {
            set({ error: error.response.data.message || 'Error in signing up', isLoading: false });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || 'Error verifying email', isLoading: false });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
            throw error;
        }
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

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false });
            return response.data.user;
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || 'Error sending reset password email',
            });
            throw error;
        }
    },

    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response.data.message || 'Error resetting password',
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
