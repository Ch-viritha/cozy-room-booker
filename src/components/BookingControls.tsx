import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shuffle, RotateCcw, CalendarCheck } from "lucide-react";

interface BookingControlsProps {
  onBook: (count: number) => void;
  onRandomOccupancy: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function BookingControls({
  onBook,
  onRandomOccupancy,
  onReset,
  isLoading,
}: BookingControlsProps) {
  const [roomCount, setRoomCount] = useState<string>("1");

  const handleBook = () => {
    const count = parseInt(roomCount, 10);
    if (count >= 1 && count <= 5) {
      onBook(count);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value, 10) >= 1 && parseInt(value, 10) <= 5)) {
      setRoomCount(value);
    }
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm p-4">
      <h2 className="font-semibold text-lg mb-4">Booking Controls</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roomCount">Number of Rooms (1-5)</Label>
          <Input
            id="roomCount"
            type="number"
            min={1}
            max={5}
            value={roomCount}
            onChange={handleInputChange}
            placeholder="Enter 1-5"
            className="w-full"
          />
        </div>
        
        <Button
          onClick={handleBook}
          disabled={isLoading || !roomCount || parseInt(roomCount, 10) < 1 || parseInt(roomCount, 10) > 5}
          className="w-full"
        >
          <CalendarCheck className="mr-2 h-4 w-4" />
          Book Rooms
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={onRandomOccupancy}
            disabled={isLoading}
            className="flex-1"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Random Occupancy
          </Button>
          
          <Button
            variant="outline"
            onClick={onReset}
            disabled={isLoading}
            className="flex-1"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
