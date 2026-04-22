import api from './api';
import { format, parseISO, differenceInMinutes } from 'date-fns';

/**
 * Mapper: Normalizes the new FastAPI Backend response into the UI shape.
 */
export const mapBusData = (trip) => {
  const depDate = parseISO(trip.departure_time);
  const arrDate = parseISO(trip.arrival_time);
  
  return {
    id: trip.id,
    tripId: trip.id,
    operatorName: trip.bus.name,
    operatorLogo: null,
    busType: trip.bus.category,
    busSubType: trip.bus.vehicle_number,
    departureTime: format(depDate, 'HH:mm'),
    arrivalTime: format(arrDate, 'HH:mm'),
    durationMinutes: differenceInMinutes(arrDate, depDate),
    from: trip.source,
    to: trip.destination,
    date: format(depDate, 'yyyy-MM-dd'),
    seatsAvailable: trip.bus.total_seats, // TODO: Update backend to return real availability
    totalSeats: trip.bus.total_seats,
    pricePerSeat: trip.price,
    rating: 4.5, // Default for now
    reviewCount: 120, // Default for now
    amenities: ['CCTV', 'Charging Point', 'Water Bottle'],
    pickupPoints: [],
    dropPoints: [],
  };
};

export const busService = {
  async searchBuses({ from, to, date }) {
    try {
      const response = await api.get('/trips/search', {
        params: { source: from, destination: to, date }
      });
      return response.data.map(mapBusData);
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Failed to fetch buses');
    }
  },

  async getBusById(busId) {
    try {
      const response = await api.get(`/trips/${busId}`);
      return mapBusData(response.data);
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Bus not found');
    }
  },
};
