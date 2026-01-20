import { Room as RoomType } from "@/types/hotel";
import { Room } from "./Room";

interface FloorProps {
  floorNumber: number;
  rooms: RoomType[];
  selectedRooms: number[];
}

export function Floor({ floorNumber, rooms, selectedRooms }: FloorProps) {
  return (
    <div className="floor-row flex items-center gap-2">
      <div className="w-8 text-xs font-semibold text-muted-foreground text-center">
        F{floorNumber}
      </div>
      <div className="flex gap-1 flex-wrap">
        {rooms.map((room) => (
          <Room
            key={room.id}
            room={room}
            isSelected={selectedRooms.includes(room.roomNumber)}
          />
        ))}
      </div>
    </div>
  );
}
