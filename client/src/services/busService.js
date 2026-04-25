import api from './api';
import dayjs from 'dayjs';

/**
 * Normalizes the latest Backend response into UI-ready state.
 */
export const mapBusData = (trip) => {
  return {
    id: trip.trip_id,
    busName: trip.bus_name,
    busNumber: trip.bus_number,
    busType: trip.bus_type,
    departureTime: dayjs(trip.departure_time).format("hh:mm A"),
    arrivalTime: dayjs(trip.arrival_time).format("hh:mm A"),
    duration: trip.trip_duration,
    price: trip.price,
    availableSeats: trip.available_seats,
    routingPoints: trip.routing_points || [],
    source: trip.source,
    destination: trip.destination,
    matchDetails: trip.match_details,
    raw: trip
  };
};

export const busService = {
  async searchBuses({ source, destination, date }) {
    try {
      const response = await api.get('/search', {
        params: { 
          source: source, 
          destination: destination, 
          travel_date: date 
        }
      });
      return (response.data || []).map(mapBusData);
    } catch (err) {
      console.error("Search API Error:", err);
      throw new Error(err.response?.data?.detail || 'Search service is temporarily unavailable');
    }
  },
};
