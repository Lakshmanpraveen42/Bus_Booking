import api from './api';

/**
 * Service to fetch available transit locations (Sources/Destinations).
 */
export const locationService = {
  getLocations: async () => {
    try {
      const res = await api.get('/locations');
      return res.data || [];
    } catch (err) {
      console.warn("Location service failed: Falling back to internal list");
      // Industrial Fallback
      return [
        "Hyderabad", "Bangalore", "Chennai", "Pune", 
        "Mumbai", "Delhi", "Kolkata", "Vijayawada", "Tirupati"
      ];
    }
  },
};
