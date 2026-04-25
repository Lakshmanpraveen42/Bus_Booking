import api from './api';

export const tripService = {
  async getLocations() {
    try {
      const response = await api.get('/locations');
      return response.data;
    } catch (err) {
      console.error('Error fetching locations:', err);
      // Fallback to empty list so logic doesn't crash
      return [];
    }
  },

  async searchTrips(params) {
    try {
      const response = await api.get('/trips/search', { params });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Search failed');
    }
  }
};
