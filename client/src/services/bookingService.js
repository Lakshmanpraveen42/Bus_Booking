import api from './api';

export const bookingService = {
  async createBooking(payload) {
    try {
      // payload from store: { tripId, selectedSeats, pricing }
      // Backend expects: { trip_id, seat_numbers, total_amount }
      const response = await api.post('/bookings/', {
        trip_id: payload.tripId,
        seat_numbers: payload.selectedSeats.join(','),
        total_amount: payload.pricing.total,
        passengers: payload.passengers,
        boarding_point: payload.boardingPoint,
        dropping_point: payload.droppingPoint
      });
      
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Booking failed');
    }
  },

  async getMyBookings() {
    try {
      const response = await api.get('/bookings/me');
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Failed to load bookings');
    }
  },

  async cancelBooking(bookingId) {
    try {
      const response = await api.post(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Cancellation failed');
    }
  }
};
