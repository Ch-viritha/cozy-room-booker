import { useState, useCallback } from "react";
import { Room } from "@/types/hotel";
import { BookingResult as BookingResultType } from "@/types/hotel";
import {
  initializeRooms,
  bookRooms,
  generateRandomOccupancy,
  resetAllBookings,
  applyBooking,
} from "@/utils/hotelUtils";

const Index = () => {
  const [rooms, setRooms] = useState<Room[]>(() => initializeRooms());
  const [lastBooking, setLastBooking] = useState<BookingResultType | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [roomCount, setRoomCount] = useState("1");

  const handleBook = useCallback(() => {
    const count = parseInt(roomCount, 10);
    if (count < 1 || count > 5) return;
    
    const result = bookRooms(rooms, count);
    setLastBooking(result);
    
    if (result.success) {
      setRooms(applyBooking(rooms, result.rooms));
      setSelectedRooms(result.rooms);
      setTimeout(() => setSelectedRooms([]), 3000);
    } else {
      setSelectedRooms([]);
    }
  }, [rooms, roomCount]);

  const handleRandomOccupancy = useCallback(() => {
    setRooms(generateRandomOccupancy(initializeRooms(), 0.4));
    setLastBooking(null);
    setSelectedRooms([]);
  }, []);

  const handleReset = useCallback(() => {
    setRooms(resetAllBookings(rooms));
    setLastBooking(null);
    setSelectedRooms([]);
  }, [rooms]);

  const floors = Array.from({ length: 10 }, (_, i) => 10 - i);
  const bookedCount = rooms.filter(r => r.isBooked).length;
  const availableCount = 97 - bookedCount;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Hotel Room Reservation
        </h1>

        {/* Controls */}
        <div className="bg-white rounded-lg border p-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Rooms:</label>
              <input
                type="number"
                min={1}
                max={5}
                value={roomCount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 5)) {
                    setRoomCount(val);
                  }
                }}
                className="w-16 px-2 py-1.5 border rounded text-center text-sm"
              />
            </div>
            <button
              onClick={handleBook}
              disabled={!roomCount || parseInt(roomCount) < 1 || parseInt(roomCount) > 5}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Book Rooms
            </button>
            <button
              onClick={handleRandomOccupancy}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              Random Occupancy
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              Reset
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-3 text-sm">
            <span className="text-gray-600">
              Available: <strong className="text-green-600">{availableCount}</strong>
            </span>
            <span className="text-gray-600">
              Booked: <strong className="text-red-600">{bookedCount}</strong>
            </span>
          </div>
        </div>

        {/* Booking Result */}
        {lastBooking && (
          <div className={`rounded-lg border p-3 mb-4 text-sm ${
            lastBooking.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
          }`}>
            <p className={lastBooking.success ? "text-green-700" : "text-red-700"}>
              {lastBooking.message}
            </p>
            {lastBooking.success && (
              <p className="text-gray-600 mt-1">
                Rooms: {lastBooking.rooms.join(", ")} | Travel Time: {lastBooking.travelTime} min
              </p>
            )}
          </div>
        )}

        {/* Hotel Building */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex gap-2">
            {/* Lift */}
            <div className="w-8 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-[8px] text-white font-medium rotate-180 [writing-mode:vertical-rl]">
                LIFT
              </span>
            </div>

            {/* Floors */}
            <div className="flex-1 space-y-1">
              {floors.map((floorNum) => {
                const floorRooms = rooms.filter(r => r.floor === floorNum);
                return (
                  <div key={floorNum} className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1">
                    <span className="w-6 text-xs text-gray-500 font-medium">F{floorNum}</span>
                    <div className="flex gap-1 flex-wrap">
                      {floorRooms.map((room) => {
                        const isSelected = selectedRooms.includes(room.roomNumber);
                        return (
                          <div
                            key={room.id}
                            className={`w-9 h-8 rounded text-[10px] font-medium flex items-center justify-center ${
                              isSelected
                                ? "bg-blue-600 text-white ring-2 ring-blue-300"
                                : room.isBooked
                                ? "bg-red-500 text-white"
                                : "bg-green-500 text-white"
                            }`}
                            title={`Room ${room.roomNumber}`}
                          >
                            {room.roomNumber}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-600" />
              <span>Just Booked</span>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="mt-4 text-xs text-gray-500">
          <p><strong>Travel:</strong> 1 min/room (horizontal), 2 min/floor (vertical)</p>
        </div>
      </div>
    </div>
  );
};

export default Index;