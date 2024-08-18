import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/v1/auth' : '/api/v1/auth';

export const useAusthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,

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
}));
