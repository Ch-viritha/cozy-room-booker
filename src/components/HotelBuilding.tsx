import { Room as RoomType } from "@/types/hotel";
import { Floor } from "./Floor";
import { Building2 } from "lucide-react";

interface HotelBuildingProps {
  rooms: RoomType[];
  selectedRooms: number[];
}

export function HotelBuilding({ rooms, selectedRooms }: HotelBuildingProps) {
  // Group rooms by floor (display from top floor 10 to floor 1)
  const floors = Array.from({ length: 10 }, (_, i) => 10 - i);

  return (
    <div className="bg-card rounded-xl border shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">Hotel Building</h2>
      </div>
      
      <div className="flex gap-3">
        {/* Elevator/Stairs shaft */}
        <div className="elevator-shaft w-10 flex flex-col items-center justify-center gap-1 py-2">
          <div className="text-[10px] text-white/80 font-medium rotate-180 [writing-mode:vertical-rl]">
            LIFT / STAIRS
          </div>
        </div>
        
        {/* Floors */}
        <div className="flex flex-col gap-2 flex-1">
          {floors.map((floorNumber) => {
            const floorRooms = rooms.filter((r) => r.floor === floorNumber);
            return (
              <Floor
                key={floorNumber}
                floorNumber={floorNumber}
                rooms={floorRooms}
                selectedRooms={selectedRooms}
              />
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded room-available" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded room-booked" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded room-selected" />
          <span>Just Booked</span>
        </div>
      </div>
    </div>
  );
}
