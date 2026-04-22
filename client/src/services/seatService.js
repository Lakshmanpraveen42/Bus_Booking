import api from './api';
import { SEAT_STATUS } from '../utils/constants';

/**
 * Helper: Generates a seat layout dynamically.
 */
const generateLayout = (totalSeats, category, bookedSeats) => {
  const layoutType = category === 'Rajadhani' ? '2+1' : '2+2';
  const seatsPerRow = layoutType === '2+2' ? 4 : 3;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);
  
  const seats = [];
  let seatIndex = 1;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];

  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < seatsPerRow; c++) {
      if (seatIndex > totalSeats) break;
      
      const seatId = `${letters[r]}${c + 1}`;
      seats.push({
        id: seatId,
        row: r + 1,
        col: c + 1,
        side: c < (seatsPerRow / 2) ? 'left' : 'right',
        deck: 'lower',
        status: bookedSeats.includes(seatId) ? SEAT_STATUS.OCCUPIED : SEAT_STATUS.AVAILABLE
      });
      seatIndex++;
    }
  }

  return {
    layout: layoutType,
    totalRows,
    decks: ['lower'],
    seats
  };
};

export const seatService = {
  async getSeatLayout(tripId) {
    try {
      const response = await api.get(`/trips/${tripId}/seats`);
      const { total_seats, category, booked_seats, trip_id } = response.data;
      
      const dynamicLayout = generateLayout(total_seats, category, booked_seats);
      
      return {
        tripId: trip_id,
        ...dynamicLayout
      };
    } catch (err) {
      throw new Error(err.response?.data?.detail || 'Failed to load seat layout');
    }
  },
};
