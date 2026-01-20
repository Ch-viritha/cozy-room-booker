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
import { HotelBuilding } from "@/components/HotelBuilding";
import { BookingControls } from "@/components/BookingControls";
import { BookingResult } from "@/components/BookingResult";
import { HotelStats } from "@/components/HotelStats";
import { Hotel } from "lucide-react";

const Index = () => {
  const [rooms, setRooms] = useState<Room[]>(() => initializeRooms());
  const [lastBooking, setLastBooking] = useState<BookingResultType | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  const handleBook = useCallback((count: number) => {
    const result = bookRooms(rooms, count);
    setLastBooking(result);
    
    if (result.success) {
      setRooms(applyBooking(rooms, result.rooms));
      setSelectedRooms(result.rooms);
      
      // Clear selection highlight after 3 seconds
      setTimeout(() => {
        setSelectedRooms([]);
      }, 3000);
    } else {
      setSelectedRooms([]);
    }
  }, [rooms]);

  const handleRandomOccupancy = useCallback(() => {
    const newRooms = generateRandomOccupancy(initializeRooms(), 0.4);
    setRooms(newRooms);
    setLastBooking(null);
    setSelectedRooms([]);
  }, []);

  const handleReset = useCallback(() => {
    setRooms(resetAllBookings(rooms));
    setLastBooking(null);
    setSelectedRooms([]);
  }, [rooms]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Hotel className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Hotel Room Reservation System
            </h1>
          </div>
          <p className="text-muted-foreground">
            97 rooms across 10 floors. Book up to 5 rooms with optimal travel time calculation.
          </p>
        </header>

        {/* Main Content */}
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          {/* Left Column - Hotel Building */}
          <div className="order-2 lg:order-1">
            <HotelBuilding rooms={rooms} selectedRooms={selectedRooms} />
          </div>

          {/* Right Column - Controls & Stats */}
          <div className="order-1 lg:order-2 space-y-4">
            <BookingControls
              onBook={handleBook}
              onRandomOccupancy={handleRandomOccupancy}
              onReset={handleReset}
            />
            <BookingResult result={lastBooking} />
            <HotelStats rooms={rooms} />
          </div>
        </div>

        {/* Travel Time Info */}
        <div className="mt-6 bg-card rounded-xl border shadow-sm p-4">
          <h3 className="font-semibold mb-2">Travel Time Rules</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• <strong>Horizontal:</strong> 1 minute per room on the same floor</li>
            <li>• <strong>Vertical:</strong> 2 minutes per floor using stairs/lift</li>
            <li>• <strong>Priority:</strong> Same floor first, then minimize total travel time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
