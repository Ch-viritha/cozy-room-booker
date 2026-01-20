import { Room as RoomType } from "@/types/hotel";
import { cn } from "@/lib/utils";

interface RoomProps {
  room: RoomType;
  isSelected?: boolean;
}

export function Room({ room, isSelected }: RoomProps) {
  const roomLabel = room.roomNumber >= 1000 
    ? room.roomNumber.toString() 
    : room.roomNumber.toString();

  return (
    <div
      className={cn(
        "room-cell",
        room.isBooked && "room-booked",
        !room.isBooked && !isSelected && "room-available",
        isSelected && "room-selected"
      )}
      title={`Room ${roomLabel} - ${room.isBooked ? 'Booked' : 'Available'}`}
    >
      {roomLabel}
    </div>
  );
}
