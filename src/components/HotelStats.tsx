import { Room } from "@/types/hotel";
import { BedDouble, BedSingle, Building } from "lucide-react";

interface HotelStatsProps {
  rooms: Room[];
}

export function HotelStats({ rooms }: HotelStatsProps) {
  const totalRooms = rooms.length;
  const bookedRooms = rooms.filter((r) => r.isBooked).length;
  const availableRooms = totalRooms - bookedRooms;
  const occupancyRate = ((bookedRooms / totalRooms) * 100).toFixed(1);

  return (
    <div className="bg-card rounded-xl border shadow-sm p-4">
      <h2 className="font-semibold text-lg mb-3">Hotel Statistics</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Building className="h-4 w-4" />
            <span>Total Rooms</span>
          </div>
          <p className="text-2xl font-bold">{totalRooms}</p>
        </div>
        
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <BedDouble className="h-4 w-4" />
            <span>Booked</span>
          </div>
          <p className="text-2xl font-bold text-[hsl(var(--room-booked))]">{bookedRooms}</p>
        </div>
        
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <BedSingle className="h-4 w-4" />
            <span>Available</span>
          </div>
          <p className="text-2xl font-bold text-[hsl(var(--room-available))]">{availableRooms}</p>
        </div>
        
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <span className="text-lg">%</span>
            <span>Occupancy</span>
          </div>
          <p className="text-2xl font-bold">{occupancyRate}%</p>
        </div>
      </div>
    </div>
  );
}
