export interface Room {
  id: number;
  floor: number;
  roomNumber: number;
  isBooked: boolean;
}

export interface BookingResult {
  rooms: number[];
  travelTime: number;
  success: boolean;
  message: string;
}

export interface HotelState {
  rooms: Room[];
  lastBooking: BookingResult | null;
}
