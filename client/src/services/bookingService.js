import api from './api';

export const bookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - The booking payload
   */
  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Get all bookings for a specific user
   * @param {string} userId - The unique user ID
   */
  async getMyBookings(userId) {
    try {
      const response = await api.get(`/users/${userId}/bookings`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  /**
   * Cancel a specific booking
   * @param {string} userId - User ID requesting cancellation
   * @param {number} bookingId - The ID of the booking to cancel
   */
  async cancelBooking(userId, bookingId) {
    try {
      const response = await api.post('/bookings/cancel', {
        user_id: userId,
        booking_id: parseInt(bookingId)
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }
};
