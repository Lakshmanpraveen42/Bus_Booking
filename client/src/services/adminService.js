import api from './api';

export const adminService = {
  /**
   * Add a new bus to the fleet
   * @param {Object} busData - { user_id, bus_number, bus_name, type, capacity }
   */
  async addBus(busData) {
    try {
      const response = await api.post('/admin/buses', busData);
      return response.data;
    } catch (error) {
      console.error('Error adding bus:', error);
      throw error;
    }
  },

  /**
   * Update an existing bus
   * @param {number} busId - The ID of the bus to update
   * @param {Object} busData - The updated bus data
   */
  async updateBus(busId, busData) {
    try {
      const response = await api.put(`/admin/buses/${busId}`, busData);
      return response.data;
    } catch (error) {
      console.error('Error updating bus:', error);
      throw error;
    }
  },

  /**
   * Get all buses for a specific admin
   * @param {string} userId - The unique admin user ID
   */
  async getBuses(userId) {
    try {
      const response = await api.get('/admin/buses', {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching buses:', error);
      throw error;
    }
  },

  /**
   * Get details for a single bus
   * @param {number} busId - The ID of the bus
   * @param {string} userId - The unique admin user ID
   */
  async getBusDetails(busId, userId) {
    try {
      const response = await api.get(`/admin/buses/${busId}`, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bus details:', error);
      throw error;
    }
  },

  /**
   * Delete a bus from the fleet
   * @param {number} busId - The ID of the bus to delete
   * @param {string} userId - The unique admin user ID
   */
  async deleteBus(busId, userId) {
    try {
      const response = await api.delete(`/admin/buses/${busId}`, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw error;
    }
  },

  /**
   * Get all trips for a specific admin
   * @param {string} userId - The unique admin user ID
   */
  async getTrips(userId) {
    try {
      const response = await api.get('/admin/trips', {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  },

  /**
   * Get details for a single trip
   * @param {number} tripId - The ID of the trip
   * @param {string} userId - The unique admin user ID
   */
  async getTripDetails(tripId, userId) {
    try {
      const response = await api.get(`/admin/trips/${tripId}`, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trip details:', error);
      throw error;
    }
  },

  /**
   * Create a new scheduled trip
   * @param {Object} tripData - { user_id, bus_id, source, destination, departure_time, arrival_time, price, routing_points }
   */
  async addTrip(tripData) {
    try {
      const response = await api.post('/admin/trips', tripData);
      return response.data;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  },

  /**
   * Update an existing scheduled trip
   * @param {number} tripId - The ID of the trip to update
   * @param {Object} tripData - The updated trip data
   * @param {string} userId - The unique admin user ID
   */
  async updateTrip(tripId, tripData, userId) {
    try {
      const response = await api.put(`/admin/trips/${tripId}`, tripData, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  /**
   * Delete/Cancel a scheduled trip
   * @param {number} tripId - The ID of the trip to delete
   * @param {string} userId - The unique admin user ID
   */
  async deleteTrip(tripId, userId) {
    try {
      const response = await api.delete(`/admin/trips/${tripId}`, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }
};
